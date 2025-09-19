'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BellIcon, CheckIcon, XIcon } from '@/components/icons'
import { Notification } from '@/types'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, filter])

  const fetchNotifications = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const params: Record<string, string> = {
        user_id: user.id,
        limit: '50',
        offset: '0'
      }
      
      if (filter === 'unread') {
        params.unread_only = 'true'
      }

      const data = await apiClient.notifications.getNotifications(params) as Notification[]
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await apiClient.notifications.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await apiClient.notifications.markAllAsRead(user.id)
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // Note: This would need to be implemented in the API client
      // await apiClient.notifications.deleteNotification(notificationId)
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (category?: string) => {
    switch (category) {
      case 'security':
        return '🔒'
      case 'billing':
        return '💳'
      case 'system':
        return '⚙️'
      case 'api':
        return '🔑'
      default:
        return '📬'
    }
  }

  const getNotificationColor = (category?: string) => {
    switch (category) {
      case 'security':
        return 'border-l-red-500'
      case 'billing':
        return 'border-l-yellow-500'
      case 'system':
        return 'border-l-blue-500'
      case 'api':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with important account activities and system alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5" />
              <span>Recent Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? 'All caught up! No unread notifications.'
                  : 'You have no notifications yet. We\'ll notify you of important account activities.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 rounded-lg transition-colors ${getNotificationColor(notification.category)} ${
                    !notification.is_read ? 'bg-accent/50' : 'bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-2xl mt-1">
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatDate(notification.created_at)}</span>
                          {notification.category && (
                            <span className="px-2 py-1 bg-muted rounded capitalize">
                              {notification.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage which notifications you receive and how you receive them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Security Alerts</div>
                <div className="text-sm text-muted-foreground">
                  Important security events and login notifications
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">API Usage</div>
                <div className="text-sm text-muted-foreground">
                  Rate limit warnings and usage milestones
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">System Updates</div>
                <div className="text-sm text-muted-foreground">
                  Maintenance schedules and system announcements
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">Billing & Account</div>
                <div className="text-sm text-muted-foreground">
                  Payment confirmations and plan changes
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}