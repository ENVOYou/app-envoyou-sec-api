export interface User {
  id: string
  email: string
  name?: string
  company?: string
  job_title?: string
  avatar_url?: string
  timezone?: string
  email_verified: boolean
  plan: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface UserProfileUpdate {
  name?: string
  company?: string
  job_title?: string
  timezone?: string
}

export interface APIKey {
  id: string
  name: string
  prefix: string
  permissions: string[]
  is_active: boolean
  last_used?: string
  usage_count: number
  created_at: string
}

export interface APIKeyCreate {
  name: string
  permissions?: string[]
}

export interface Session {
  id: string
  device_info?: string
  ip_address?: string
  location?: string
  last_active: string
  created_at: string
}

export interface UserStats {
  total_requests: number
  requests_today: number
  requests_this_month: number
  api_keys_count: number
  active_sessions: number
}

export interface Notification {
  id: string
  title: string
  message: string
  category?: string
  is_read: boolean
  created_at: string
}

export interface EmissionData {
  id: string
  state?: string
  year?: number
  pollutant?: string
  value: number
  unit: string
  source?: string
}

export interface EmissionStats {
  total_records: number
  states_covered: number
  years_range: {
    min: number
    max: number
  }
  pollutants: string[]
}

export interface Plan {
  name: string
  requests_limit: number
  requests_used: number
  features: string[]
}

export interface DeveloperStats {
  requests_count: number
  requests_limit: number
  rate_limit_remaining: number
  rate_limit_reset: number
}

export interface UsageAnalytics {
  period: string
  total_requests: number
  successful_requests: number
  error_requests: number
  endpoints_usage: Array<{
    endpoint: string
    count: number
  }>
}