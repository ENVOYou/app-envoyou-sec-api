// Adapters to normalize backend responses to frontend TypeScript interfaces
// Keep pure functions (no side effects) so they are easy to test.

import type { UserStats, APIKey, Session, Notification, EmissionData, EmissionStats, DeveloperStats, UsageAnalytics } from '@/types'

type Dict = Record<string, unknown>

// User Stats adapter (backend -> frontend)
export function adaptUserStats(raw: unknown): UserStats {
  console.log('adaptUserStats raw response:', raw) // Debug log
  if (!raw || typeof raw !== 'object') {
    return {
      total_requests: 0,
      requests_today: 0,
      requests_this_month: 0,
      api_keys_count: 0,
      active_sessions: 0
    }
  }
  const r = raw as Dict
  const adapted = {
    total_requests: (r.total_calls as number) ?? 0,
    requests_today: 0,
    requests_this_month: (r.monthly_calls as number) ?? (r.total_calls as number) ?? 0,
    api_keys_count: (r.active_keys as number) ?? 0,
    active_sessions: (r.active_sessions as number) ?? 0
  }
  console.log('adaptUserStats result:', adapted) // Debug log
  return adapted
}

// API Keys list adapter
export function adaptAPIKeys(raw: unknown): APIKey[] {
  console.log('adaptAPIKeys raw response:', raw) // Debug log
  if (!raw) return []
  if (Array.isArray(raw)) return raw as APIKey[]
  const r = raw as Dict
  if (Array.isArray(r.api_keys)) {
    console.log('Found api_keys array:', r.api_keys) // Debug log
    return r.api_keys as APIKey[]
  }
  console.log('No api_keys found in response') // Debug log
  return []
}

// Sessions list adapter
export function adaptSessions(raw: unknown): Session[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw as Session[]
  const r = raw as Dict
  if (Array.isArray(r.sessions)) return r.sessions as Session[]
  return []
}

// Notifications adapter (backend uses `read` -> frontend expects `is_read`)
export function adaptNotifications(raw: unknown): Notification[] {
  if (!raw) return []
  const r = raw as Dict
  const list: unknown = Array.isArray(raw) ? raw : r.data
  if (!Array.isArray(list)) return []
  return list.map((n) => {
    const item = n as Dict
    return {
      id: String(item.id),
      title: item.title as string,
      message: item.message as string,
      category: item.category as string | undefined,
      is_read: Boolean(item.read),
      created_at: item.created_at as string,
    }
  })
}

// Emission data adapter (backend wraps in { status, data, ... })
export function adaptEmissions(raw: unknown): EmissionData[] {
  if (!raw) return []
  const r = raw as Dict
  const arr: unknown = Array.isArray(raw) ? raw : r.data
  if (!Array.isArray(arr)) return []
  return arr.map((d) => {
    const rec = d as Dict
    const y = rec.year
    return {
      id: String(rec.id ?? rec.facility_id ?? rec.hash ?? ''),
      state: rec.state as string | undefined,
      year: typeof y === 'number' ? y : (typeof y === 'string' ? (parseInt(y, 10) || undefined) : undefined),
      pollutant: rec.pollutant as string | undefined,
      value: Number(rec.value ?? rec.amount ?? rec.emission_value ?? 0),
      unit: (rec.unit as string) || (rec.unit_type as string) || 'unknown',
      source: (rec.source as string) || (r.source as string) || undefined
    }
  })
}

// Emission stats adapter
export function adaptEmissionStats(raw: unknown): EmissionStats | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Dict
  if (!r.statistics || typeof r.statistics !== 'object') return null
  const stats = r.statistics as Dict
  const byYear = (stats.by_year as Dict) || {}
  const years = Object.keys(byYear).filter(y => /^\d+$/.test(y)).map(y => parseInt(y, 10))
  return {
    total_records: (stats.total_records as number) ?? 0,
    states_covered: Object.keys((stats.by_state as Dict) || {}).length,
    years_range: {
      min: years.length ? Math.min(...years) : 0,
      max: years.length ? Math.max(...years) : 0
    },
    pollutants: Object.keys((stats.by_pollutant as Dict) || {})
  }
}

// Developer stats adapter
export function adaptDeveloperStats(raw: unknown): DeveloperStats {
  const r = (raw as Dict) || {}
  return {
    requests_count: (r.requests_count as number) ?? 0,
    requests_limit: (r.requests_limit as number) ?? 10000,
    rate_limit_remaining: (r.rate_limit_remaining as number) ?? 0,
    rate_limit_reset: (r.rate_limit_reset as number) ?? 0
  }
}

// Usage analytics adapter
export function adaptUsageAnalytics(raw: unknown): UsageAnalytics {
  const r = (raw as Dict) || {}
  return {
    period: (r.period as string) ?? '24h',
    total_requests: (r.total_requests as number) ?? 0,
    successful_requests: (r.successful_requests as number) ?? 0,
    error_requests: (r.error_requests as number) ?? 0,
    endpoints_usage: Array.isArray(r.endpoints_usage) ? (r.endpoints_usage as Array<{endpoint: string; count: number}>) : []
  }
}

// Rate limits adapter (string -> parsed parts if pattern known)
export function parseRateLimitInfo(limitStr: string | undefined): { raw: string; limit: number; window_seconds: number } {
  if (!limitStr) return { raw: '', limit: 0, window_seconds: 0 }
  // Example expected pattern: "1000/3600" meaning 1000 per hour
  const match = limitStr.match(/(\d+)\/(\d+)/)
  if (match) {
    return { raw: limitStr, limit: parseInt(match[1], 10), window_seconds: parseInt(match[2], 10) }
  }
  return { raw: limitStr, limit: 0, window_seconds: 0 }
}
