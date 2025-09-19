'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, apiClient } from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ error?: string }>
  signInWithProvider: (provider: 'google' | 'github') => Promise<{ error?: string }>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  signInWithEmail: async () => ({ error: 'Context not initialized' }),
  signUpWithEmail: async () => ({ error: 'Context not initialized' }),
  signInWithProvider: async () => ({ error: 'Context not initialized' }),
  resetPassword: async () => ({ error: 'Context not initialized' })
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        // Verify with backend and get user data
        const response = await apiClient.auth.supabaseVerify(session.access_token) as any
        setUser(response.user)
        apiClient.setToken(response.access_token)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
      apiClient.setToken(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) return { error: error.message }
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) return { error: error.message }
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signInWithProvider = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) return { error: error.message }
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) return { error: error.message }
      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setSupabaseUser(session.user)
        try {
          // Verify with backend
          const response = await apiClient.auth.supabaseVerify(session.access_token) as any
          setUser(response.user || null)
          apiClient.setToken(response.access_token || null)
        } catch (error) {
          console.error('Error verifying user:', error)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)
          try {
            const response = await apiClient.auth.supabaseVerify(session.access_token) as any
            setUser(response.user || null)
            apiClient.setToken(response.access_token || null)
          } catch (error) {
            console.error('Error verifying user:', error)
          }
        } else {
          setSupabaseUser(null)
          setUser(null)
          apiClient.setToken(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabaseUser])

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      loading,
      signOut,
      refreshUser,
      signInWithEmail,
      signUpWithEmail,
      signInWithProvider,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}