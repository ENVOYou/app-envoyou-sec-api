import { createClient } from '@supabase/supabase-js'
import type { UserProfileUpdate } from '@/types'
import {
  adaptUserStats,
  adaptAPIKeys,
  adaptSessions,
  adaptNotifications,
  adaptEmissions,
  adaptEmissionStats,
  adaptDeveloperStats,
  adaptUsageAnalytics,
  parseRateLimitInfo
} from './adapters'

// Types for user calculations (mirror backend /user/calculations response)
export interface CalculationResponse {
  id: string
  company: string
  name?: string
  calculation_data: Record<string, unknown>
  result: Record<string, unknown>
  version: string
  created_at: string
}

export interface CalculationListResponse {
  calculations: CalculationResponse[]
  total: number
  page: number
  limit: number
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true
  }
})

// API Client for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.envoyou.com'

class APIClient {
  private baseUrl: string
  private token: string | null = null
  private refreshToken: string | null = null
  private storageKey = 'envoyou_internal_tokens'

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(this.storageKey)
        if (raw) {
          const parsed = JSON.parse(raw) as { access_token?: string; refresh_token?: string; ts?: number }
            this.token = parsed.access_token || null
            this.refreshToken = parsed.refresh_token || null
        }
      } catch { /* ignore */ }
    }
  }

  setToken(token: string | null, refresh?: string | null) {
    this.token = token
    if (refresh !== undefined) this.refreshToken = refresh
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          window.localStorage.setItem(this.storageKey, JSON.stringify({ access_token: token, refresh_token: this.refreshToken, ts: Date.now() }))
        } else {
          window.localStorage.removeItem(this.storageKey)
        }
      } catch { /* ignore */ }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    if (this.token) headers.Authorization = `Bearer ${this.token}`

    let response: Response
    try {
      response = await fetch(url, { ...options, headers })
    } catch (e) {
      const err = e as { message?: string }
      throw new Error(`Network Error: ${err?.message || 'unknown error'}`)
    }

    let body: unknown = null
    const text = await response.text()
    if (text) {
      try { body = JSON.parse(text) } catch { body = text }
    }

    if (!response.ok) {
      const b = body as Record<string, unknown> | string | null
      const msg = typeof b === 'object' && b !== null
        ? (b.detail as string) || (b.message as string) || `${response.status} ${response.statusText}`
        : `${response.status} ${response.statusText}`
      throw new Error(msg)
    }
    return body as T
  }

  // Auth endpoints
  auth = {
    supabaseVerify: async (token: string) => {
  const res = await this.request<{ access_token: string; refresh_token: string; user: { id: string; email: string; name?: string; email_verified?: boolean; auth_provider?: string }; token_type: string; message: string }>(
        '/v1/auth/supabase/verify',
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ supabase_token: token })
        }
      )
      this.setToken(res.access_token, res.refresh_token)
      return res
    },
    getMe: () => this.request('/v1/auth/supabase/me')
  }

  // User endpoints
  user = {
    getProfile: () => this.request('/v1/user/profile'),
    updateProfile: (data: UserProfileUpdate) => 
      this.request('/v1/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    uploadAvatar: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const url = `${this.baseUrl}/v1/user/avatar`
      const headers: Record<string, string> = {}
      if (this.token) headers.Authorization = `Bearer ${this.token}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || `${response.status} ${response.statusText}`)
      }
      
      return response.json()
    },
    getAPIKeys: async () => adaptAPIKeys(await this.request('/v1/user/api-keys')),
    createAPIKey: (data: { name: string; permissions?: string[] }) => 
      this.request('/v1/user/api-keys', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    deleteAPIKey: (keyId: string) => 
      this.request(`/v1/user/api-keys/${keyId}`, {
        method: 'DELETE'
      }),
    getStats: async () => adaptUserStats(await this.request('/v1/user/stats')),
    getSessions: async () => adaptSessions(await this.request('/v1/user/sessions')),
    getPlan: () => this.request('/v1/user/plan'),
    // Fetch user's calculation history (emissions calculations)
    getCalculations: (page = 1, limit = 20) => this.request<CalculationListResponse>(`/v1/user/calculations?page=${page}&limit=${limit}`),
    // Save a calculation (backend supports POST to /user/calculations)
    saveCalculation: (payload: { company: string; calculation_data: Record<string, unknown>; result?: Record<string, unknown>; version?: string }) =>
      this.request('/v1/user/calculations', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    // Delete a saved calculation
    deleteCalculation: (calculationId: string) =>
      this.request(`/v1/user/calculations/${calculationId}`, {
        method: 'DELETE'
      }),
    // Get user activity log
    getActivity: (limit = 20) => this.request(`/v1/user/activity?limit=${limit}`)
  }

  // Global data endpoints (requires API key)
  global = {
    getEmissions: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      const raw = await this.request(`/global/emissions${query}`)
      return adaptEmissions(raw)
    },
    getEmissionsStats: async () => adaptEmissionStats(await this.request('/global/emissions/stats')),
    getISO: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/global/iso${query}`)
    },
    getEEA: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/global/eea${query}`)
    }
  }

  // Notifications
  notifications = {
    getNotifications: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      const raw = await this.request(`/notifications/${query}`)
      return adaptNotifications(raw)
    },
    getCount: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/notifications/count${query}`)
    },
    markAsRead: (notificationId: string) => 
      this.request(`/notifications/${notificationId}/read`, {
        method: 'PUT'
      }),
    markAllAsRead: (userId: string) => 
      this.request(`/notifications/read-all?user_id=${userId}`, {
        method: 'PUT'
      })
  }

  // SEC API endpoints
  emissions = {
    getFactors: () => this.request('/v1/emissions/factors'),
    getUnits: () => this.request('/v1/emissions/units'),
    calculate: (data: {
      company: string
      scope1?: { fuel_type: string; amount: number; unit: string }
      scope2?: { kwh: number; grid_region: string }
    }) => this.request('/v1/emissions/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  validation = {
    epa: (data: {
      company: string
      scope1?: { fuel_type: string; amount: number; unit: string }
      scope2?: { kwh: number; grid_region: string }
    }) => this.request('/v1/validation/epa', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  export = {
    secGhg: (company: string) => this.request(`/v1/export/sec/ghg/${company}`),
    secPackage: (data: {
      company: string
      scope1?: { fuel_type: string; amount: number; unit: string }
      scope2?: { kwh: number; grid_region: string }
    }) => this.request('/v1/export/sec/package', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // Developer stats
  developer = {
    getStats: async () => adaptDeveloperStats(await this.request('/v1/developer/stats')),
    getUsageAnalytics: async (hours?: number) => {
      const query = hours ? `?hours=${hours}` : ''
      const raw = await this.request(`/v1/developer/usage-analytics${query}`)
      return adaptUsageAnalytics(raw)
    },
    getRateLimits: async () => {
      const raw = await this.request('/v1/developer/rate-limits') as unknown
      const r = raw as { data?: { rate_limit?: string } }
      const info = parseRateLimitInfo(r.data?.rate_limit)
      return { ...(r as object), parsed: info }
    }
  }
}

export const apiClient = new APIClient(API_BASE_URL)
