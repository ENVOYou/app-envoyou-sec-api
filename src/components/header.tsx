'use client'

import { useAuth } from '@/hooks/useAuth'
import { BellIcon, UserIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useScrollElevation } from '@/hooks/useScrollElevation'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { user } = useAuth()
  const elevated = useScrollElevation(8)

  return (
    <header
      className="app-chrome select-none"
      data-scrolled={elevated ? 'true' : 'false'}
      role="banner"
    >
      <div className="flex w-full items-center justify-between px-6">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="ts-page-title bg-clip-text text-transparent bg-[linear-gradient(to_right,hsl(var(--foreground)/0.92),hsl(var(--primary)/0.9))] tracking-tight">
            {title || 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 px-0" aria-label="Notifications">
            <BellIcon className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <button
            type="button"
            className="flex items-center gap-2 focus-ring-soft rounded-full pl-0.5 pr-2 py-0.5 hover:bg-accent/40 transition-colors"
            aria-haspopup="menu"
            aria-label="User menu"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <UserIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs font-medium truncate max-w-[120px]">
                {user?.name || user?.email || 'Loading...'}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {user?.plan || 'Free Plan'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}