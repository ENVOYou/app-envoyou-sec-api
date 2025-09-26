'use client'

import { Search, Bell, User, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  className?: string
  sidebarCollapsed?: boolean
  onMobileMenuToggle?: () => void
}

export function Header({ className, sidebarCollapsed = false, onMobileMenuToggle }: HeaderProps = {}) {
  const { user } = useAuth()

  return (
    <header 
      className={`fixed top-0 right-0 left-0 lg:${sidebarCollapsed ? 'left-16' : 'left-64'} h-16 border-b-2 border-border z-30 shadow-md transition-all duration-300 ${className || ''}`}
      style={{ backgroundColor: 'hsl(var(--secondary))' }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile menu button */}
        <button 
          onClick={onMobileMenuToggle}
          className="lg:hidden p-3 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile search button */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent">
            <Search className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}