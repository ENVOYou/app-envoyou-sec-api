'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { 
  DashboardIcon, 
  UserIcon, 
  KeyIcon, 
  BarChartIcon, 
  GlobeIcon, 
  BellIcon, 
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon
} from '@/components/icons'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Usage & Analytics', href: '/dashboard/analytics', icon: BarChartIcon },
  { name: 'Global Data', href: '/dashboard/global-data', icon: GlobeIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-8 w-8 px-0"
        >
          {isOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-surface-alt/85 dark:bg-surface-alt/65 backdrop-blur-md z-30 transition-colors"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-surface dark:bg-surface shadow-card dark:shadow-cardDark lg:translate-x-0 chrome-hairline-y overflow-hidden transition-[width,transform] duration-200 ease-in-out",
        collapsed ? 'w-16' : 'w-64',
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )} aria-label="Primary">
        <div className="flex h-full flex-col">
          {/* Chrome top bar inside sidebar */}
          <div className="flex h-16 items-center px-4 chrome-hairline-x">
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <Logo size={collapsed ? 32 : 36} withWordmark={!collapsed} wordmarkClassName="text-base font-semibold" />
              {collapsed && <span className="sr-only">Envoyou</span>}
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="ml-auto h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {collapsed ? <span className="text-xs font-medium">»</span> : <span className="text-xs font-medium">«</span>}
            </button>
          </div>

          {/* Navigation */}
          <nav className={cn("flex-1 py-4", collapsed ? 'px-1 space-y-1' : 'px-3 space-y-1')}>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'chrome-nav-item group relative',
                    isActive && 'data-[active=true]' // allow both aria-current and data-active matching
                  )}
                  data-active={isActive ? 'true' : undefined}
                >
                  <item.icon className="chrome-nav-item-icon" />
                  {collapsed ? <span className="sr-only">{item.name}</span> : <span className="truncate">{item.name}</span>}
                  {collapsed && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap rounded-md bg-surface-strong dark:bg-surface-strong text-foreground px-2 py-1 text-[11px] font-medium shadow-card border border-border opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 z-50"
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="mt-auto chrome-hairline-x px-3 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.plan || 'Free Plan'}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className={cn("w-full justify-start h-8", collapsed ? 'px-0 flex items-center justify-center' : 'px-3')}
              aria-label="Sign out"
            >
              <LogOutIcon className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Sign out</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}