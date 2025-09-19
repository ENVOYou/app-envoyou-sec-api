'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/api'
import { LoadingIcon } from '@/components/icons/index'
import { AuthError, mapSupabaseError } from '@/lib/authErrors'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (data.session) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          setTimeout(() => { router.push('/dashboard') }, 1500)
        } else {
          const { data: { user } } = await supabase.auth.getUser()
          if (user && !user.email_confirmed_at) {
            setStatus('success')
            setMessage('Please check your email and click the confirmation link.')
            setTimeout(() => { router.push('/auth/login') }, 3000)
          } else {
            setStatus('error')
            setMessage('Authentication failed. Please try again.')
            setTimeout(() => { router.push('/auth/login') }, 3000)
          }
        }
      } catch (err: unknown) {
        const mapped = mapSupabaseError(err)
        setError(mapped)
        setStatus('error')
        setMessage(mapped.message)
        setTimeout(() => { router.push('/auth/login') }, 3000)
      }
    }
    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-4">
          {status === 'loading' && (
            <>
              <div className="mx-auto w-12 h-12 text-primary">
                <LoadingIcon className="w-12 h-12 animate-spin" />
              </div>
              <h1 className="text-xl font-semibold">Processing authentication...</h1>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-green-600 dark:text-green-400">
                Success!
              </h1>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Error
              </h1>
            </>
          )}
        </div>
        
        <p className="text-muted-foreground">{message}</p>
        {status === 'error' && error?.details && (
          <p className="text-xs text-muted-foreground/70">{error.details}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  )
}