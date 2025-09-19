import { describe, it, expect } from 'vitest'
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
} from '../adapters'

describe('adapters', () => {
  it('adaptUserStats maps backend fields', () => {
    const result = adaptUserStats({ total_calls: 10, monthly_calls: 8, active_keys: 2 })
    expect(result.total_requests).toBe(10)
    expect(result.requests_this_month).toBe(8)
    expect(result.api_keys_count).toBe(2)
  })

  it('adaptAPIKeys unwraps api_keys array', () => {
    const keys = adaptAPIKeys({ api_keys: [{ id: '1', name: 'k', prefix: 'pk', permissions: [], is_active: true, usage_count: 0, created_at: '' }] })
    expect(keys.length).toBe(1)
  })

  it('adaptSessions unwraps sessions', () => {
    const sessions = adaptSessions({ sessions: [{ id: 's1', last_active: '', created_at: '' }] })
    expect(sessions[0].id).toBe('s1')
  })

  it('adaptNotifications maps read to is_read', () => {
    const notifs = adaptNotifications([{ id: 1, title: 't', message: 'm', read: true, created_at: '' }])
    expect(notifs[0].is_read).toBe(true)
  })

  it('adaptEmissions maps wrapper data', () => {
    const list = adaptEmissions({ data: [{ id: 5, value: '12', unit: 'kg' }] })
    expect(list[0].value).toBe(12)
  })

  it('adaptEmissionStats computes years range', () => {
    const stats = adaptEmissionStats({ statistics: { by_year: { '2020': 1, '2021': 2 }, by_state: {}, by_pollutant: {}, total_records: 3 } })
    expect(stats?.years_range.min).toBe(2020)
    expect(stats?.years_range.max).toBe(2021)
  })

  it('adaptDeveloperStats extracts total_calls', () => {
    const dev = adaptDeveloperStats({ data: { total_calls: 42 } })
    expect(dev.requests_count).toBe(42)
  })

  it('adaptUsageAnalytics aggregates usage_count', () => {
    const usage = adaptUsageAnalytics({ data: { window_hours: 24, activity: [{ usage_count: 3 }] } })
    expect(usage.total_requests).toBe(3)
  })

  it('parseRateLimitInfo parses pattern', () => {
    const parsed = parseRateLimitInfo('1000/3600')
    expect(parsed.limit).toBe(1000)
    expect(parsed.window_seconds).toBe(3600)
  })
})
