// Adapters to normalize backend responses to frontend TypeScript interfaces
// Keep pure functions (no side effects) so they are easy to test.

import type { UserStats, APIKey, Session, Notification, EmissionData, EmissionStats, DeveloperStats, UsageAnalytics } from '@/types'

// User Stats adapter (backend -> frontend)
export function adaptUserStats(raw: any): UserStats {
  if (!raw) {
    return {
      total_requests: 0,
      requests_today: 0,
      requests_this_month: 0,
      api_keys_count: 0,
      active_sessions: 0
    }
  }
  return {
    total_requests: raw.total_calls ?? 0,
    requests_today: 0, // backend belum sediakan
    requests_this_month: raw.monthly_calls ?? raw.total_calls ?? 0,
    api_keys_count: raw.active_keys ?? 0,
    active_sessions: 0 // tidak ada data langsung, bisa diisi dari sessions length di tempat lain
  }
}

// API Keys list adapter
export function adaptAPIKeys(raw: any): APIKey[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as APIKey[]
  if (Array.isArray(raw.api_keys)) return raw.api_keys as APIKey[]
  return []
}

// Sessions list adapter
export function adaptSessions(raw: any): Session[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as Session[]
  if (Array.isArray(raw.sessions)) return raw.sessions as Session[]
  return []
}

// Notifications adapter (backend uses `read` -> frontend expects `is_read`)
export function adaptNotifications(raw: any): Notification[] {
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : raw.data || []
  return list.map((n: any) => ({
    id: String(n.id),
    title: n.title,
    message: n.message,
    category: n.category,
    is_read: Boolean(n.read),
    created_at: n.created_at,
  }))
}

// Emission data adapter (backend wraps in { status, data, ... })
export function adaptEmissions(raw: any): EmissionData[] {
  if (!raw) return []
  const arr = Array.isArray(raw) ? raw : raw.data || []
  return arr.map((d: any) => ({
    id: String(d.id ?? d.facility_id ?? d.hash ?? ''),
    state: d.state,
    year: typeof d.year === 'number' ? d.year : parseInt(d.year, 10) || undefined,
    pollutant: d.pollutant,
    value: Number(d.value ?? d.amount ?? d.emission_value ?? 0),
    unit: d.unit || d.unit_type || 'unknown',
    source: d.source || raw.source || undefined
  }))
}

// Emission stats adapter
export function adaptEmissionStats(raw: any): EmissionStats | null {
  if (!raw || !raw.statistics) return null
  const stats = raw.statistics
  const years = Object.keys(stats.by_year || {}).filter(y => /^\d+$/.test(y)).map(y => parseInt(y, 10))
  return {
    total_records: stats.total_records ?? 0,
    states_covered: Object.keys(stats.by_state || {}).length,
    years_range: {
      min: years.length ? Math.min(...years) : 0,
      max: years.length ? Math.max(...years) : 0
    },
    pollutants: Object.keys(stats.by_pollutant || {})
  }
}

// Developer stats adapter
export function adaptDeveloperStats(raw: any): DeveloperStats {
  const data = raw?.data || raw || {}
  return {
    requests_count: data.total_calls ?? 0,
    requests_limit: 0, // tidak disediakan backend
    rate_limit_remaining: 0, // perlu endpoint rate limit detail jika tersedia
    rate_limit_reset: 0 // placeholder
  }
}

// Usage analytics adapter
export function adaptUsageAnalytics(raw: any): UsageAnalytics {
  const data = raw?.data || raw || {}
  return {
    period: `${data.window_hours || 24}h`,
    total_requests: Array.isArray(data.activity) ? data.activity.reduce((acc: number, k: any) => acc + (k.usage_count || 0), 0) : 0,
    successful_requests: 0,
    error_requests: 0,
    endpoints_usage: Array.isArray(data.activity) ? data.activity.map((k: any) => ({ endpoint: k.prefix || k.key_id || 'unknown', count: k.usage_count || 0 })) : []
  }
}

// Rate limits adapter (string -> parsed parts if pattern known)
export function parseRateLimitInfo(limitStr: string | undefined) {
  if (!limitStr) return { raw: '', limit: 0, window_seconds: 0 }
  // Example expected pattern: "1000/3600" meaning 1000 per hour
  const match = limitStr.match(/(\d+)\/(\d+)/)
  if (match) {
    return { raw: limitStr, limit: parseInt(match[1], 10), window_seconds: parseInt(match[2], 10) }
  }
  return { raw: limitStr, limit: 0, window_seconds: 0 }
}
