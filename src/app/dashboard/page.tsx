'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { UserStats, DeveloperStats } from '@/types'
import { BarChart3, Key, Calculator, Activity } from 'lucide-react'

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user?.name || user?.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor your SEC compliance and API usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-semibold">{userStats?.total_requests?.toLocaleString() || 0}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Keys</p>
              <p className="text-2xl font-semibold">{userStats?.api_keys_count || 0}</p>
            </div>
            <Key className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
              <p className="text-2xl font-semibold">{developerStats?.rate_limit_remaining?.toLocaleString() || 0}</p>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions</p>
              <p className="text-2xl font-semibold">{userStats?.active_sessions || 0}</p>
            </div>
            <Calculator className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">API Usage</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Requests this month</span>
              <span className="font-medium">{userStats?.requests_this_month?.toLocaleString() || 0}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((userStats?.requests_this_month || 0) / (developerStats?.requests_limit || 1000)) * 100,
                    100
                  )}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{developerStats?.requests_limit?.toLocaleString() || 1000} limit</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/dashboard/sec-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <Calculator className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">SEC Calculator</p>
                <p className="text-sm text-muted-foreground">Calculate emissions</p>
              </div>
            </a>
            <a href="/dashboard/api-keys" className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
              <Key className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">API Keys</p>
                <p className="text-sm text-muted-foreground">Manage access</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}