export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'PASSWORD_MISMATCH'
  | 'PASSWORD_WEAK'
  | 'EMAIL_NOT_CONFIRMED'
  | 'OAUTH_ERROR'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'UNKNOWN'

export interface AuthError {
  code: AuthErrorCode
  message: string
  details?: string
  cause?: unknown
}

const codeMessage: Record<AuthErrorCode, string> = {
  INVALID_EMAIL: 'Email tidak valid atau belum terdaftar',
  INVALID_PASSWORD: 'Password salah',
  PASSWORD_MISMATCH: 'Konfirmasi password tidak sama',
  PASSWORD_WEAK: 'Password belum memenuhi persyaratan',
  EMAIL_NOT_CONFIRMED: 'Email belum dikonfirmasi. Silakan cek inbox Anda',
  OAUTH_ERROR: 'Gagal login sosial. Coba lagi',
  RATE_LIMIT: 'Terlalu banyak percobaan. Coba beberapa saat lagi',
  NETWORK: 'Masalah jaringan. Periksa koneksi Anda',
  UNKNOWN: 'Terjadi kesalahan tak terduga'
}

export function createAuthError(code: AuthErrorCode, overrides?: Partial<AuthError>): AuthError {
  return {
    code,
    message: codeMessage[code],
    ...overrides
  }
}

// Supabase error mapping (subset of common error messages)
interface SupabaseLikeError { message?: string }

export function mapSupabaseError(err: unknown): AuthError {
  if (!err) return createAuthError('UNKNOWN')
  const message = typeof err === 'string'
    ? err
    : (typeof err === 'object' && err !== null && 'message' in err
        ? (err as SupabaseLikeError).message || ''
        : '')

  // Basic heuristics
  if (/Invalid login credentials/i.test(message)) return createAuthError('INVALID_PASSWORD', { details: message })
  if (/Email not confirmed/i.test(message)) return createAuthError('EMAIL_NOT_CONFIRMED', { details: message })
  if (/rate limit/i.test(message)) return createAuthError('RATE_LIMIT', { details: message })
  if (/network/i.test(message)) return createAuthError('NETWORK', { details: message })

  return createAuthError('UNKNOWN', { details: message })
}

export function getAuthErrorMessage(error: AuthError | null): string {
  return error ? error.message : ''
}
