'use client'

import { useAuth } from '@/hooks/useAuth'
import { BellIcon, UserIcon } from '@/components/icons'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth()

  return (
  <header className="h-16 bg-surface-alt/95 dark:bg-surface-alt/75 backdrop-blur-md border-b border-borderBase/60 dark:border-borderBase/35 shadow-[0_2px_0_0_hsl(var(--border-base)/0.6)]">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-[linear-gradient(to_right,hsl(var(--foreground)/0.92),hsl(var(--primary)/0.9))]">
            {title || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
            <BellIcon className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block text-sm">
              <div className="font-medium">
                {user?.name || user?.email}
              </div>
              <div className="text-muted-foreground text-xs">
                {user?.plan || 'Free Plan'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}