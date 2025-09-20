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
}

export function Sidebar({ className }: SidebarProps) {
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
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30" // Gunakan warna tema
    onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-white/90 dark:bg-neutral-950/95 border-r border-white/30 dark:border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_-6px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-transform lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <GlobeIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Envoyou</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm border-l-2 border-primary/70"
                      : "text-muted-foreground hover:text-primary/90 hover:bg-primary/5 hover:border-l-2 hover:border-primary/40"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )} />
                  <span className={cn(
                    "truncate",
                    isActive && "font-medium"
                  )}>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.plan || 'Free Plan'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start h-8 px-3"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}