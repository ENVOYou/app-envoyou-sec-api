'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/api'

declare global {
  interface Window { supabase: typeof supabase }
}

export function SupabaseDebugExpose() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.supabase = supabase
      // Intentionally minimal log; remove in production if noisy
      // console.debug('[DEBUG] window.supabase exposed')
    }
  }, [])
  return null
}
