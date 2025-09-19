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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// API Client for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

class APIClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string | null) {
    this.token = token
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
    } catch (e: any) {
      throw new Error(`Network Error: ${e.message || e}`)
    }

    let body: any = null
    const text = await response.text()
    if (text) {
      try { body = JSON.parse(text) } catch { body = text }
    }

    if (!response.ok) {
      const msg = body?.detail || body?.message || `${response.status} ${response.statusText}`
      throw new Error(msg)
    }
    return body as T
  }

  // Auth endpoints
  auth = {
    supabaseVerify: (token: string) =>
      this.request('/v1/auth/supabase/verify', {
        method: 'POST',
        body: JSON.stringify({ supabase_token: token })
      }),
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
    getPlan: () => this.request('/v1/user/plan')
  }

  // Global data endpoints (requires API key)
  global = {
    getEmissions: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      const raw = await this.request(`/v1/global/emissions${query}`)
      return adaptEmissions(raw)
    },
    getEmissionsStats: async () => adaptEmissionStats(await this.request('/v1/global/emissions/stats')),
    getISO: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/v1/global/iso${query}`)
    },
    getEEA: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/v1/global/eea${query}`)
    }
  }

  // Notifications
  notifications = {
    getNotifications: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      const raw = await this.request(`/v1/notifications/${query}`)
      return adaptNotifications(raw)
    },
    getCount: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/v1/notifications/count${query}`)
    },
    markAsRead: (notificationId: string) => 
      this.request(`/v1/notifications/${notificationId}/read`, {
        method: 'PUT'
      }),
    markAllAsRead: (userId: string) => 
      this.request(`/v1/notifications/read-all?user_id=${userId}`, {
        method: 'PUT'
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
      const raw = await this.request('/v1/developer/rate-limits') as any
      const info = parseRateLimitInfo(raw?.data?.rate_limit)
      return { ...raw, parsed: info }
    }
  }
}

export const apiClient = new APIClient(API_BASE_URL)