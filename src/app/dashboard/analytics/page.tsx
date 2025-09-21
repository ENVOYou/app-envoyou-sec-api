'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChartIcon, GlobeIcon } from '@/components/icons'
import { DeveloperStats, UsageAnalytics } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AnalyticsPage() {
  const [developerStats, setDeveloperStats] = useState<DeveloperStats | null>(null)
  const [usageAnalytics, setUsageAnalytics] = useState<UsageAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<number>(24)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        apiClient.developer.getStats(),
        apiClient.developer.getUsageAnalytics(timeRange)
      ])
      
      setDeveloperStats(statsRes as DeveloperStats)
      setUsageAnalytics(analyticsRes as UsageAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Mock data for demonstration since we don't have real chart data
  const mockChartData = [
    { name: '00:00', requests: 12 },
    { name: '04:00', requests: 5 },
    { name: '08:00', requests: 28 },
    { name: '12:00', requests: 45 },
    { name: '16:00', requests: 32 },
    { name: '20:00', requests: 18 }
  ]

  const mockEndpointData = usageAnalytics?.endpoints_usage || [
    { endpoint: '/v1/global/emissions', count: 150 },
    { endpoint: '/v1/global/eea', count: 89 },
    { endpoint: '/v1/user/profile', count: 45 },
    { endpoint: '/v1/global/iso', count: 32 },
    { endpoint: '/v1/notifications', count: 28 }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
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
  <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your API usage, performance, and rate limits.
          </p>
        </div>
        <div className="flex space-x-2">
          {[24, 168, 720].map((hours) => (
            <Button
              key={hours}
              variant={timeRange === hours ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(hours)}
            >
              {hours === 24 ? '24h' : hours === 168 ? '7d' : '30d'}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="grid-item">
        <Card variant="raised" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageAnalytics?.total_requests?.toLocaleString() || '1,284'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {timeRange === 24 ? '24 hours' : timeRange === 168 ? '7 days' : '30 days'}
            </p>
          </CardContent>
    </Card>
    </div>
    <div className="grid-item">
  <Card variant="raised" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageAnalytics ? 
                `${((usageAnalytics.successful_requests / usageAnalytics.total_requests) * 100).toFixed(1)}%` :
                '98.5%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {usageAnalytics?.successful_requests?.toLocaleString() || '1,265'} successful requests
            </p>
          </CardContent>
    </Card>
    </div>
    <div className="grid-item">
  <Card variant="raised" className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {developerStats?.rate_limit_remaining?.toLocaleString() || '8,716'}
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining this hour
            </p>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Charts */}
  <div className="grid gap-8 md:grid-cols-2">
        {/* Request Timeline */}
  <div className="grid-item"><Card variant="strong">
          <CardHeader>
            <CardTitle>Request Timeline</CardTitle>
            <CardDescription>
              API requests over the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
  </Card></div>

        {/* Top Endpoints */}
  <div className="grid-item"><Card variant="strong">
          <CardHeader>
            <CardTitle>Top Endpoints</CardTitle>
            <CardDescription>
              Most frequently accessed endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockEndpointData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="endpoint" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card></div>
      </div>

      {/* Detailed metrics */}
  <div className="grid gap-8 md:grid-cols-2">
        {/* Rate Limit Details */}
  <div className="grid-item"><Card variant="raised">
          <CardHeader>
            <CardTitle>Rate Limit Status</CardTitle>
            <CardDescription>
              Current rate limit usage and remaining quota
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Requests Used</span>
              <span className="text-sm font-medium">
                {((developerStats?.requests_limit || 10000) - (developerStats?.rate_limit_remaining || 8716)).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ 
                  width: `${((((developerStats?.requests_limit || 10000) - (developerStats?.rate_limit_remaining || 8716)) / (developerStats?.requests_limit || 10000)) * 100)}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{developerStats?.requests_limit?.toLocaleString() || '10,000'} / hour</span>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Reset Time</div>
              <div className="text-sm">
                {developerStats?.rate_limit_reset ? 
                  new Date(developerStats.rate_limit_reset * 1000).toLocaleTimeString() :
                  new Date(Date.now() + 3600000).toLocaleTimeString()
                }
              </div>
            </div>
          </CardContent>
  </Card></div>

        {/* Performance Metrics */}
  <div className="grid-item"><Card variant="raised">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Request success rates and error breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Successful Requests</span>
                <span className="text-sm font-medium text-green-600">
                  {usageAnalytics?.successful_requests?.toLocaleString() || '1,265'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Failed Requests</span>
                <span className="text-sm font-medium text-red-600">
                  {usageAnalytics?.error_requests?.toLocaleString() || '19'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Success Rate</span>
                <span className="text-sm font-medium">
                  {usageAnalytics ? 
                    `${((usageAnalytics.successful_requests / usageAnalytics.total_requests) * 100).toFixed(1)}%` :
                    '98.5%'
                  }
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Period</div>
              <div className="text-sm">
                {usageAnalytics?.period || `Last ${timeRange === 24 ? '24 hours' : timeRange === 168 ? '7 days' : '30 days'}`}
              </div>
            </div>
          </CardContent>
        </Card></div>
      </div>
    </div>
  )
}