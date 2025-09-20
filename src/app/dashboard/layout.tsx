'use client'

import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-black text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <Sidebar />
      <div className="lg:pl-64 relative z-10">
        <Header />
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          {children}
        </main>
      </div>
    </div>
  )
}