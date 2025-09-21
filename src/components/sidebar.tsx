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
          className="lg:hidden fixed inset-0 bg-surface-alt/85 dark:bg-surface-alt/65 backdrop-blur-md z-30 transition-colors"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen w-64 bg-surface dark:bg-surface border-r border-borderBase/60 dark:border-borderBase/30 shadow-card dark:shadow-cardDark transition-transform lg:translate-x-0 after:absolute after:top-0 after:right-[-1px] after:w-px after:h-full after:bg-[linear-gradient(to_bottom,hsl(var(--border-base)/0.35),hsl(var(--border-base)/0))]",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center">
              <Logo size={36} withWordmark wordmarkClassName="text-base font-semibold" />
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
                      ? "relative text-primary bg-gradient-to-r from-primary/15 via-primary/10 to-transparent hover:from-primary/18 hover:via-primary/12 focus:outline-none focus:ring-2 focus:ring-primary/40 before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:shadow-[inset_0_0_0_1px_hsl(var(--border-base)/0.45),inset_0_1px_0_0_hsl(var(--foreground)/0.25)]"
                      : "text-muted hover:text-primary hover:bg-accent/60 hover:shadow-[inset_0_0_0_1px_hsl(var(--border-base)/0.35)] focus:outline-none focus:ring-2 focus:ring-primary/30"
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