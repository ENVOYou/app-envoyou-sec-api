'use client'

import { Search, Bell, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  className?: string
  title?: string
}

export function Header({ className, title }: HeaderProps = {}) {
  const { user } = useAuth()

  return (
    <header 
      className={`fixed top-0 right-0 left-64 h-16 border-b-2 border-border z-40 shadow-md ${className || ''}`}
      style={{ backgroundColor: 'hsl(var(--secondary))' }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-80 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}