'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/theme-provider'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsIcon, UserIcon, BellIcon, LogOutIcon, SunIcon, MoonIcon } from '@/components/icons'
import { Session } from '@/types'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const sessionsData = await apiClient.user.getSessions() as Session[]
      setSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to terminate this session?')) return
    
    try {
      // This would need to be implemented in the API client
      console.log('Terminating session:', sessionId)
      await fetchSessions()
    } catch (error) {
      console.error('Error terminating session:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getDeviceIcon = (deviceInfo?: string) => {
    if (!deviceInfo) return '💻'
    const info = deviceInfo.toLowerCase()
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) return '📱'
    if (info.includes('tablet') || info.includes('ipad')) return '📱'
    return '💻'
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and security options.
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>Account Overview</span>
          </CardTitle>
          <CardDescription>
            Your account information and subscription details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email Address
                </label>
                <p className="text-sm">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <p className="text-sm">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Company
                </label>
                <p className="text-sm">{user?.company || 'Not set'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Current Plan
                </label>
                <p className="text-sm">{user?.plan || 'Free Plan'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Account Created
                </label>
                <p className="text-sm">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email Status
                </label>
                <p className="text-sm">
                  {user?.email_verified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Not verified</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => window.location.href = '/dashboard/profile'}>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>
            Customize the appearance of the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex space-x-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  <SunIcon className="h-4 w-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="h-4 w-4 mr-2" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  System
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Choose your preferred color theme or use system preference.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Configure which notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: 'Security Alerts',
                description: 'Login attempts, password changes, and security events',
                enabled: true
              },
              {
                title: 'API Usage Notifications',
                description: 'Rate limit warnings and usage milestones',
                enabled: true
              },
              {
                title: 'System Updates',
                description: 'Maintenance schedules and new features',
                enabled: false
              },
              {
                title: 'Marketing Communications',
                description: 'Product updates and promotional emails',
                enabled: false
              }
            ].map((pref, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="font-medium">{pref.title}</div>
                  <div className="text-sm text-muted-foreground">{pref.description}</div>
                </div>
                <Button variant="outline" size="sm">
                  {pref.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions across different devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active sessions found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getDeviceIcon(session.device_info)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {session.device_info || 'Unknown Device'}
                      </div>
                      <div className="text-sm text-muted-foreground space-x-2">
                        <span>IP: {session.ip_address || 'Unknown'}</span>
                        {session.location && <span>• {session.location}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active: {formatDate(session.last_active)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
            <div>
              <div className="font-medium">Sign Out</div>
              <div className="text-sm text-muted-foreground">
                Sign out of your account on all devices
              </div>
            </div>
            <Button variant="destructive" onClick={signOut}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
            <div>
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}