import { createClient } from '@supabase/supabase-js'

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

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  auth = {
    supabaseVerify: (token: string) => 
      this.request('/v1/auth/supabase/verify', {
        method: 'POST',
        body: JSON.stringify({ token })
      }),
    getMe: () => this.request('/v1/auth/supabase/me')
  }

  // User endpoints
  user = {
    getProfile: () => this.request('/v1/user/profile'),
    updateProfile: (data: any) => 
      this.request('/v1/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    getAPIKeys: () => this.request('/v1/user/api-keys'),
    createAPIKey: (data: any) => 
      this.request('/v1/user/api-keys', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    deleteAPIKey: (keyId: string) => 
      this.request(`/v1/user/api-keys/${keyId}`, {
        method: 'DELETE'
      }),
    getStats: () => this.request('/v1/user/stats'),
    getSessions: () => this.request('/v1/user/sessions'),
    getPlan: () => this.request('/v1/user/plan')
  }

  // Global data endpoints (requires API key)
  global = {
    getEmissions: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/v1/global/emissions${query}`)
    },
    getEmissionsStats: () => this.request('/v1/global/emissions/stats'),
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
    getNotifications: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ''
      return this.request(`/v1/notifications/${query}`)
    },
    getCount: (params?: Record<string, string>) => {
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
    getStats: () => this.request('/v1/developer/stats'),
    getUsageAnalytics: (hours?: number) => {
      const query = hours ? `?hours=${hours}` : ''
      return this.request(`/v1/developer/usage-analytics${query}`)
    },
    getRateLimits: () => this.request('/v1/developer/rate-limits')
  }
}

export const apiClient = new APIClient(API_BASE_URL)