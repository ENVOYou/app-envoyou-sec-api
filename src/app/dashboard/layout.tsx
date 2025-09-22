'use client'

import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useCallback, type CSSProperties } from 'react'

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

  const sidebarWidth = collapsed ? '4rem' : '16rem'
  const layoutStyle: CSSProperties = { ['--sidebar-w' as string]: sidebarWidth }

  return (
  <div className="h-screen overflow-hidden bg-background text-foreground" style={layoutStyle}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header className="with-sidebar" />
      <div className="flex h-full">
        <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} className="bg-surface/92 dark:bg-surface/85 sidebar-panel" />
        <div className="flex-1 min-w-0 h-full overflow-hidden relative">
          {/* Spacer to offset content under fixed sidebar on large screens without distorting inner horizontal padding */}
          <div className="hidden lg:block absolute inset-y-0 left-0" style={{ width: 'var(--sidebar-w)' }} aria-hidden="true" />
          <div className="h-full overflow-y-auto overscroll-contain pt-[var(--header-height)]">
            <main id="main-content" className="p-6 lg:p-10 space-y-10 max-w-full">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}