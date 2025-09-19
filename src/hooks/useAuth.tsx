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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {}
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
      refreshUser
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