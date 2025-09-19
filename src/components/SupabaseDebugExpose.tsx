'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/api'

export function SupabaseDebugExpose() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).supabase = supabase
      console.log('[DEBUG] window.supabase exposed')
    }
  }, [])
  return null
}
