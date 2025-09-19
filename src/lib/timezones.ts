// Curated common IANA timezones plus full lookup map utilities.
// Keep list stable (alphabetical by label within region groups) for deterministic dropdown.

export interface TimezoneOption {
  value: string
  label: string
  offset: string // Precomputed standard UTC offset (no DST) as "+/-HH:MM"
  group: string // Region grouping e.g. Americas, Europe, Asia, Africa, Oceania, Other
}

// Minimal helper to format offset from minutes
const fmt = (mins: number) => {
  const sign = mins >= 0 ? '+' : '-'
  const abs = Math.abs(mins)
  const h = String(Math.trunc(abs / 60)).padStart(2, '0')
  const m = String(abs % 60).padStart(2, '0')
  return `${sign}${h}:${m}`
}

// Static offsets (standard, ignoring DST) for curated zones.
// Sources: IANA TZDB (representative standard offsets) gathered manually.
const base: Array<[string, string, number, string]> = [
  // value, label, offsetMinutes, group
  ['UTC', 'UTC', 0, 'Other'],
  // Americas
  ['America/Los_Angeles', 'Pacific (Los Angeles)', -480, 'Americas'],
  ['America/Denver', 'Mountain (Denver)', -420, 'Americas'],
  ['America/Chicago', 'Central (Chicago)', -360, 'Americas'],
  ['America/New_York', 'Eastern (New York)', -300, 'Americas'],
  ['America/Sao_Paulo', 'Sao Paulo', -180, 'Americas'],
  ['America/Mexico_City', 'Mexico City', -360, 'Americas'],
  ['America/Bogota', 'Bogota', -300, 'Americas'],
  ['America/Lima', 'Lima', -300, 'Americas'],
  ['America/Santiago', 'Santiago', -240, 'Americas'],
  // Europe
  ['Europe/London', 'London', 0, 'Europe'],
  ['Europe/Dublin', 'Dublin', 0, 'Europe'],
  ['Europe/Lisbon', 'Lisbon', 0, 'Europe'],
  ['Europe/Paris', 'Paris', 60, 'Europe'],
  ['Europe/Berlin', 'Berlin', 60, 'Europe'],
  ['Europe/Madrid', 'Madrid', 60, 'Europe'],
  ['Europe/Rome', 'Rome', 60, 'Europe'],
  ['Europe/Amsterdam', 'Amsterdam', 60, 'Europe'],
  ['Europe/Prague', 'Prague', 60, 'Europe'],
  ['Europe/Stockholm', 'Stockholm', 60, 'Europe'],
  ['Europe/Athens', 'Athens', 120, 'Europe'],
  ['Europe/Helsinki', 'Helsinki', 120, 'Europe'],
  ['Europe/Istanbul', 'Istanbul', 180, 'Europe'],
  ['Europe/Moscow', 'Moscow', 180, 'Europe'],
  // Africa
  ['Africa/Casablanca', 'Casablanca', 0, 'Africa'],
  ['Africa/Accra', 'Accra', 0, 'Africa'],
  ['Africa/Lagos', 'Lagos', 60, 'Africa'],
  ['Africa/Cairo', 'Cairo', 120, 'Africa'],
  ['Africa/Johannesburg', 'Johannesburg', 120, 'Africa'],
  ['Africa/Nairobi', 'Nairobi', 180, 'Africa'],
  // Asia
  ['Asia/Jerusalem', 'Jerusalem', 120, 'Asia'],
  ['Asia/Dubai', 'Dubai', 240, 'Asia'],
  ['Asia/Karachi', 'Karachi', 300, 'Asia'],
  ['Asia/Kolkata', 'Kolkata', 330, 'Asia'],
  ['Asia/Dhaka', 'Dhaka', 360, 'Asia'],
  ['Asia/Bangkok', 'Bangkok', 420, 'Asia'],
  ['Asia/Shanghai', 'Shanghai', 480, 'Asia'],
  ['Asia/Singapore', 'Singapore', 480, 'Asia'],
  ['Asia/Hong_Kong', 'Hong Kong', 480, 'Asia'],
  ['Asia/Taipei', 'Taipei', 480, 'Asia'],
  ['Asia/Tokyo', 'Tokyo', 540, 'Asia'],
  ['Asia/Seoul', 'Seoul', 540, 'Asia'],
  ['Asia/Jakarta', 'Jakarta', 420, 'Asia'],
  ['Asia/Manila', 'Manila', 480, 'Asia'],
  ['Asia/Ho_Chi_Minh', 'Ho Chi Minh', 420, 'Asia'],
  ['Asia/Baku', 'Baku', 240, 'Asia'],
  ['Asia/Almaty', 'Almaty', 300, 'Asia'],
  // Oceania
  ['Australia/Perth', 'Perth', 480, 'Oceania'],
  ['Australia/Adelaide', 'Adelaide', 570, 'Oceania'],
  ['Australia/Sydney', 'Sydney', 600, 'Oceania'],
  ['Pacific/Auckland', 'Auckland', 720, 'Oceania'],
  ['Pacific/Fiji', 'Fiji', 720, 'Oceania'],
  ['Pacific/Honolulu', 'Honolulu', -600, 'Oceania'],
]

export const timezones: TimezoneOption[] = base.map(([value, label, mins, group]) => ({
  value,
  label: `${label} (UTC${fmt(mins)})`,
  offset: fmt(mins),
  group,
}))

export const timezoneGroups = Array.from(new Set(timezones.map(t => t.group)))

export function findTimezone(value: string) {
  return timezones.find(t => t.value === value) || null
}

// Provide a reasonable default (use Intl if available else UTC)
export function detectLocalTimezone(): string {
  if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz && findTimezone(tz)) return tz
    } catch {
      /* ignore */
    }
  }
  return 'UTC'
}
