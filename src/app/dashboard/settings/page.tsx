"use client"
import { useState, useEffect, useRef, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/theme-provider'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SettingsIcon, UserIcon, BellIcon, LogOutIcon, SunIcon, MoonIcon } from '@/components/icons'
import { Session } from '@/types'
import { useToast } from '@/components/ui/toast'
import { timezones, timezoneGroups, detectLocalTimezone } from '@/lib/timezones'

export default function SettingsPage() {
  const { user, signOut, updateUserLocal } = useAuth()
  const { theme, setTheme } = useTheme()
  const { push: pushToast } = useToast()
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

  const [editMode, setEditMode] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [company, setCompany] = useState(user?.company || '')
  const [jobTitle, setJobTitle] = useState(user?.job_title || '')
  const [timezone, setTimezone] = useState(user?.timezone || '')
  const autoSaveTimer = useRef<number | null>(null)
  const [savingMode, setSavingMode] = useState<'manual' | 'auto' | null>(null)

  // Snapshot original values for dirty check
  const original = useMemo(() => ({
    name: user?.name || '',
    company: user?.company || '',
    job_title: user?.job_title || '',
    timezone: user?.timezone || ''
  }), [user?.name, user?.company, user?.job_title, user?.timezone])

  const dirty = (
    name !== original.name ||
    company !== original.company ||
    jobTitle !== original.job_title ||
    timezone !== original.timezone
  )

  useEffect(() => {
    // sync when user changes (e.g. after refreshUser)
    setName(user?.name || '')
    setCompany(user?.company || '')
    setJobTitle(user?.job_title || '')
    setTimezone(user?.timezone || detectLocalTimezone())
  }, [user])

  interface PartialUserUpdate {
    name?: string
    company?: string
    job_title?: string
    timezone?: string
  }

  const applyOptimistic = (partial: PartialUserUpdate) => {
    updateUserLocal(partial)
  }

  const handleSave = async (mode: 'manual' | 'auto' = 'manual') => {
    if (!dirty) return
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = null
    }
    setSavingMode(mode)
    setProfileLoading(true)
    const prev = { name: user?.name, company: user?.company, job_title: user?.job_title, timezone: user?.timezone }
    const partial = {
      name: name.trim() || undefined,
      company: company.trim() || undefined,
      job_title: jobTitle.trim() || undefined,
      timezone: timezone.trim() || undefined
    }
    applyOptimistic(partial)
    try {
      await apiClient.user.updateProfile(partial)
      if (mode === 'manual') {
        pushToast({ variant: 'success', title: 'Profile Saved', message: 'Your profile changes were saved.' })
        setEditMode(false)
      } else {
        pushToast({ variant: 'success', message: 'Profile autosaved.' })
      }
    } catch (e) {
      // revert
      applyOptimistic(prev)
      pushToast({ variant: 'error', title: 'Save Failed', message: e instanceof Error ? e.message : 'Failed to update profile' })
    } finally {
      setProfileLoading(false)
      setSavingMode(null)
    }
  }

  const handleCancel = () => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = null
    }
    setName(original.name)
    setCompany(original.company)
    setJobTitle(original.job_title)
    setTimezone(original.timezone || detectLocalTimezone())
    setEditMode(false)
  }

  // Debounced autosave when editing
  useEffect(() => {
    if (!editMode) return
    if (!dirty) return
    if (profileLoading) return
  if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = window.setTimeout(() => {
      handleSave('auto')
    }, 1500)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, company, jobTitle, timezone, editMode])

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings, preferences, and security options.
        </p>
      </div>

  {/* Account Overview (primary focus) */}
  <Card variant="strong">
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
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Profile Details</div>
            <div className="space-x-2">
              {!editMode && (
                <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
              )}
              {editMode && (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancel} disabled={profileLoading}>Cancel</Button>
                  <Button size="sm" onClick={() => handleSave('manual')} disabled={profileLoading}>Save</Button>
                </>
              )}
            </div>
          </div>
          {/* Inline messages removed in favor of toast system */}
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
                {editMode ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="h-9" />
                ) : (
                  <p className="text-sm">{user?.name || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Company
                </label>
                {editMode ? (
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="h-9" />
                ) : (
                  <p className="text-sm">{user?.company || 'Not set'}</p>
                )}
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
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Job Title
                </label>
                {editMode ? (
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title" className="h-9" />
                ) : (
                  <p className="text-sm">{user?.job_title || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Timezone
                </label>
                {editMode ? (
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="" disabled>Select timezone</option>
                    {timezoneGroups.map(group => (
                      <optgroup key={group} label={group}>
                        {timezones.filter(t => t.group === group).map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm">{user?.timezone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
          {profileLoading && (
            <p className="mt-4 text-xs text-muted-foreground">
              {savingMode === 'auto' ? 'Autosaving…' : 'Saving…'}
            </p>
          )}
        </CardContent>
      </Card>

  {/* Appearance (secondary) */}
  <Card variant="raised">
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
  <Card variant="raised">
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
  <Card variant="raised">
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
  <Card variant="strong" className="border border-destructive/40">
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