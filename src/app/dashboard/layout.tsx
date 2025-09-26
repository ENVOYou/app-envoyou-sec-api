'use client'

import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<boolean>(false)

  // Load persisted state
  useEffect(() => {
    try {
      const stored = localStorage.getItem('envoyou.sidebarCollapsed')
      if (stored) setCollapsed(stored === 'true')
    } catch {}
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem('envoyou.sidebarCollapsed', String(next)) } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      // Rely on middleware to handle redirect to /auth/login
      router.replace('/auth/login')
    }
  }, [user, loading, router])

  // Reset scroll on route change inside dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={toggleCollapsed}
      />
      <Header 
        className="with-sidebar" 
        sidebarCollapsed={collapsed}
      />
      <main className={`lg:${collapsed ? 'ml-16' : 'ml-64'} pt-16 transition-all duration-300`}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}