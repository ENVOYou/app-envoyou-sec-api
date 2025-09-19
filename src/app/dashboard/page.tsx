'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserStats, DeveloperStats, UsageAnalytics } from '@/types'
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
          Here's an overview of your account activity and API usage.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.total_requests?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {userStats?.requests_today || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <KeyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.api_keys_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active keys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {developerStats?.rate_limit_remaining?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining this hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <BellIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.active_sessions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Current sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Usage This Month</CardTitle>
            <CardDescription>
              Track your monthly API consumption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Requests Used</span>
                <span className="text-sm font-medium">
                  {userStats?.requests_this_month?.toLocaleString() || 0}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(
                      ((userStats?.requests_this_month || 0) / (developerStats?.requests_limit || 1000)) * 100, 
                      100
                    )}%` 
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{developerStats?.requests_limit?.toLocaleString() || 1000} limit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your account and API settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a 
              href="/dashboard/api-keys" 
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <KeyIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Manage API Keys</div>
                <div className="text-xs text-muted-foreground">Create and manage your API keys</div>
              </div>
            </a>
            <a 
              href="/dashboard/global-data" 
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <GlobeIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Explore Global Data</div>
                <div className="text-xs text-muted-foreground">Access environmental datasets</div>
              </div>
            </a>
            <a 
              href="/dashboard/analytics" 
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <BarChartIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">View Analytics</div>
                <div className="text-xs text-muted-foreground">Detailed usage statistics</div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}