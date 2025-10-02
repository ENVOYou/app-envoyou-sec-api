'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { KeyIcon, PlusIcon, CopyIcon, TrashIcon, EyeIcon, EyeOffIcon } from '@/components/icons'
import { APIKey } from '@/types'

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyData, setNewKeyData] = useState<{ key: string; name: string } | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const fetchAPIKeys = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        console.log('Force refreshing API keys...') // Debug log
      }
      const keys = await apiClient.user.getAPIKeys() as APIKey[]
      console.log('Fetched API keys:', keys) // Debug log
      console.log('Number of keys:', keys?.length || 0) // Debug log
      setApiKeys(keys || [])
    } catch (error) {
      console.error('Error fetching API keys:', error)
      // Don't clear existing keys on error, just log it
    } finally {
      setLoading(false)
    }
  }

  const createAPIKey = async () => {
    if (!newKeyName.trim()) return

    setCreating(true)
    try {
      const response = await apiClient.user.createAPIKey({ name: newKeyName }) as { key: string }
      console.log('API key created:', response) // Debug log
      setNewKeyData({ key: response.key, name: newKeyName })
      setNewKeyName('')
      // Don't fetch immediately, wait for modal to close
    } catch (error) {
      console.error('Error creating API key:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('Maximum of 2 API keys')) {
        alert('You have reached the maximum limit of 2 API keys. Please delete an existing key first.')
      } else {
        alert(`Error creating API key: ${errorMessage}`)
      }
    } finally {
      setCreating(false)
    }
  }

  const deleteAPIKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to delete the API key "${keyName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiClient.user.deleteAPIKey(keyId)
      console.log('API key deleted, refreshing list...') // Debug log
      await fetchAPIKeys(true) // Force refresh
    } catch (error) {
      console.error('Error deleting API key:', error)
      alert('Error deleting API key. Please try again.')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const maskKey = (key: string) => {
    if (!key) return 'sk-xxxxxxxxxx'
    return key.substring(0, 7) + '...' + key.substring(key.length - 4)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground mt-2">
          Manage your API keys to access Envoyou&apos;s environmental data endpoints.
        </p>
      </div>

      {/* New API Key Modal */}
      {newKeyData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="grid-item w-full max-w-md mx-4"><Card className="w-full max-w-md mx-0">
            <CardHeader>
              <CardTitle>API Key Created</CardTitle>
              <CardDescription>
                Copy your new API key now. You won&apos;t be able to see it again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input value={newKeyData.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    API Key
                  </label>
                  <div className="flex space-x-2">
                    <Input value={newKeyData.key} disabled className="font-mono text-sm" />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(newKeyData.key)}
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={async () => {
                  setNewKeyData(null)
                  // Add small delay to ensure backend has processed the creation
                  setTimeout(() => {
                    fetchAPIKeys(true) // Force refresh
                  }, 500)
                }}>
                  Done
                </Button>
              </div>
            </CardContent>
          </Card></div>
        </div>
      )}

      {/* Create new API Key */}
  <div className="surface-section mb-6"><div className="grid-item"><Card className="mb-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create New API Key</span>
          </CardTitle>
          <CardDescription>
            Generate a new API key to authenticate your requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter API key name (e.g., Production App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={createAPIKey} disabled={creating || !newKeyName.trim()}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </CardContent>
  </Card></div></div>

      {/* API Keys List */}
  <div className="surface-section"><div className="grid-item"><Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <KeyIcon className="h-5 w-5" />
              <span>Your API Keys</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchAPIKeys(true)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </CardTitle>
          <CardDescription>
            Manage your existing API keys. Keep them secure and don&apos;t share them publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <KeyIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No API Keys</h3>
              <p className="text-muted-foreground">
                Create your first API key to start using the Envoyou API.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{key.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        key.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {key.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {visibleKeys[key.id] ? key.prefix + '...' : maskKey(key.prefix)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys[key.id] ? (
                            <EyeOffIcon className="h-3 w-3" />
                          ) : (
                            <EyeIcon className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(key.prefix)}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                      <span>
                        Created: {new Date(key.created_at).toLocaleDateString()}
                      </span>
                      <span>
                        Usage: {key.usage_count.toLocaleString()} requests
                      </span>
                      {key.last_used && (
                        <span>
                          Last used: {new Date(key.last_used).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAPIKey(key.id, key.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
  </Card></div></div>

      {/* Usage Guidelines */}
  <div className="surface-section mt-6"><div className="grid-item"><Card className="mt-0">
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Authentication</h4>
            <p className="text-sm text-muted-foreground">
              Include your API key in the request headers as <code className="px-1 py-0.5 bg-muted rounded text-xs">Authorization: Bearer YOUR_API_KEY</code> 
              or as a query parameter <code className="px-1 py-0.5 bg-muted rounded text-xs">?api_key=YOUR_API_KEY</code>
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Rate Limits</h4>
            <p className="text-sm text-muted-foreground">
              API keys are subject to rate limiting. Check your current limits in the Analytics section.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Security</h4>
            <p className="text-sm text-muted-foreground">
              Keep your API keys secure and don&apos;t commit them to version control. 
              Regenerate keys immediately if they&apos;re compromised.
            </p>
          </div>
        </CardContent>
  </Card></div></div>
    </div>
  )
}