'use client'

import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, type CSSProperties } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
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

  const sidebarWidth = collapsed ? '4rem' : '16rem'
  const layoutStyle: CSSProperties = { ['--sidebar-w' as string]: sidebarWidth }

  return (
  <div className="min-h-screen bg-background text-foreground" style={layoutStyle}>
      <div className="pointer-events-none absolute inset-0 hidden dark:block dark:opacity-[0.04] dark:bg-[radial-gradient(circle_at_25%_20%,hsl(var(--foreground)/0.15),transparent_55%),linear-gradient(to_right,hsl(var(--foreground)/0.18)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.12)_1px,transparent_1px)] dark:bg-[size:100%_100%,70px_70px,70px_70px]" aria-hidden="true" />
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} className="bg-surface/92 dark:bg-surface/85" />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header className="hidden lg:flex" />
      {/* Mobile header inline inside flow if needed (reuse existing Header inline for <lg) */}
      <div className="lg:pl-[var(--sidebar-w)] pt-[var(--header-height)]">
        <main id="main-content" className="p-6 lg:p-10 space-y-10">
          {children}
        </main>
      </div>
    </div>
  )
}