'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
// Removed unused Card components after refactor to DepthCard
import { DepthCard } from '@/components/ui/depth-card'
import { UserStats, DeveloperStats } from '@/types'
import { BarChartIcon, KeyIcon, GlobeIcon, BellIcon } from '@/components/icons'

export default function DashboardPage() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [developerStats, setDeveloperStats] = useState<DeveloperStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStatsRes, devStatsRes] = await Promise.all([
          apiClient.user.getStats(),
          apiClient.developer.getStats()
        ])
        
        setUserStats(userStatsRes as UserStats)
        setDeveloperStats(devStatsRes as DeveloperStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || user?.email?.split('@')[0]}!
        </h2>
        <p className="text-muted-foreground mt-2">
          Here&apos;s an overview of your account activity and API usage.
        </p>
      </div>

      {/* Stats cards (refactored with DepthCard for hierarchy) */}
      <div className="relative">
        <div className="surface-gradient rounded-3xl p-1.5 md:p-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="grid-item">
            <DepthCard depth="lg" accent="primary" density="compact" className="group">
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Total Requests</span>
                <BarChartIcon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <div className="text-2xl font-semibold leading-tight">
                {userStats?.total_requests?.toLocaleString() || 0}
              </div>
              <p className="text-[11px] mt-1 text-muted-foreground">
                {userStats?.requests_today || 0} today
              </p>
            </DepthCard>
            </div>
            <div className="grid-item">
            <DepthCard depth="md" density="compact" className="group">
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">API Keys</span>
                <KeyIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
              <div className="text-2xl font-semibold leading-tight">
                {userStats?.api_keys_count || 0}
              </div>
              <p className="text-[11px] mt-1 text-muted-foreground">
                Active keys
              </p>
            </DepthCard>
            </div>
            <div className="grid-item">
            <DepthCard depth="md" density="compact" className="group">
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Rate Limit</span>
                <GlobeIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
              <div className="text-2xl font-semibold leading-tight">
                {developerStats?.rate_limit_remaining?.toLocaleString() || 0}
              </div>
              <p className="text-[11px] mt-1 text-muted-foreground">
                Remaining this hour
              </p>
            </DepthCard>
            </div>
            <div className="grid-item">
            <DepthCard depth="sm" density="compact" className="group">
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Active Sessions</span>
                <BellIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
              <div className="text-2xl font-semibold leading-tight">
                {userStats?.active_sessions || 0}
              </div>
              <p className="text-[11px] mt-1 text-muted-foreground">
                Current sessions
              </p>
            </DepthCard>
            </div>
          </div>
        </div>
      </div>

      {/* Usage overview (depth + pattern) */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid-item">
        <DepthCard depth="lg" density="base" className="relative overflow-hidden">
          <div className="mb-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">API Usage This Month</h3>
            <p className="text-sm text-muted-foreground mt-1">Track your monthly API consumption</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Requests Used</span>
              <span className="text-sm font-medium">
                {userStats?.requests_this_month?.toLocaleString() || 0}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/70 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/80 via-primary to-primary/60 transition-all"
                style={{
                  width: `${Math.min(
                    ((userStats?.requests_this_month || 0) / (developerStats?.requests_limit || 1000)) * 100,
                    100
                  )}%`
                }}
              />
              <div className="absolute inset-0 dot-grid-faint opacity-30 pointer-events-none" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>{developerStats?.requests_limit?.toLocaleString() || 1000} limit</span>
            </div>
          </div>
  </DepthCard>
  </div>
  <div className="grid-item">
  <DepthCard depth="md" density="base" className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage your account and API settings</p>
          </div>
          <div className="space-y-2">
            <a
              href="/dashboard/api-keys"
              className="group flex items-center space-x-3 p-3 rounded-xl border border-borderBase/50 hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <KeyIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <div>
                <div className="font-medium leading-tight">Manage API Keys</div>
                <div className="text-[11px] text-muted-foreground">Create and manage your API keys</div>
              </div>
            </a>
            <a
              href="/dashboard/global-data"
              className="group flex items-center space-x-3 p-3 rounded-xl border border-borderBase/50 hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <GlobeIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <div>
                <div className="font-medium leading-tight">Explore Global Data</div>
                <div className="text-[11px] text-muted-foreground">Access environmental datasets</div>
              </div>
            </a>
            <a
              href="/dashboard/analytics"
              className="group flex items-center space-x-3 p-3 rounded-xl border border-borderBase/50 hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <BarChartIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <div>
                <div className="font-medium leading-tight">View Analytics</div>
                <div className="text-[11px] text-muted-foreground">Detailed usage statistics</div>
              </div>
            </a>
          </div>
        </DepthCard>
        </div>
      </div>
    </div>
  )
}