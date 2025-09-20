"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'

declare global {
  interface Window {
    __ENV_DARK_CHECK__?: boolean
  }
}
import { AuroraBackground, Typewriter, StaggerUpdatesList, UpdatesCarousel, FloatingIcon } from './auth-animations'
import { Logo } from './logo'

interface AuthSplitLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  updates?: { title: string; description: string; date?: string }[]
  className?: string
  forceCarousel?: boolean
}

/*
  Split screen layout:
  - Left: branding + feature updates (hidden on small screens -> stacked vertical)
  - Right: form card area
  Keeps palette from global tokens; focuses on clean minimal structure.
*/
export function AuthSplitLayout({
  children,
  title = 'Envoyou Platform',
  subtitle = 'Unified environmental data & insights',
  updates = [],
  className,
  forceCarousel = false
}: AuthSplitLayoutProps) {
  const headlineIsFuture = /soon|coming|realtime|real-time|future|next/i.test(title)
  const useCarousel = forceCarousel || updates.length > 3
  const topHighlight = useMemo(() => updates.slice(0, 3), [updates])
  if (typeof window !== 'undefined') {
    const rootHasDark = document.documentElement.classList.contains('dark')
    window.__ENV_DARK_CHECK__ = rootHasDark
  }
  return (
  <div className={cn('min-h-screen grid lg:grid-cols-2 bg-background text-foreground relative dark:bg-background', className)}>
      {/* Dark mode subtle radial accent using primary token */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.15),transparent_60%)]" />
      {/* Left / Branding Panel */}
      <div className="relative hidden lg:flex flex-col overflow-hidden border-r border-borderBase/70 dark:border-borderBase/40 bg-surface dark:bg-surface/75">
        <div className="absolute top-0 right-0 h-full w-10 pointer-events-none select-none">
          <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-r from-black/5 via-transparent to-transparent dark:from-black/40 dark:via-black/10 dark:to-transparent" />
          <div className="absolute top-0 right-0 h-full w-8 hidden dark:block bg-[radial-gradient(circle_at_left,hsl(var(--primary)/0.18),transparent_70%)] opacity-[0.22] mix-blend-plus-lighter" />
        </div>
        <div className="hidden dark:block"><AuroraBackground /></div>
        <div className="relative z-10 flex flex-col h-full p-12 gap-12">
          <header className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2 relative">
              <Logo size={42} withWordmark wordmarkClassName="group-hover:text-primary transition-colors" />
              <FloatingIcon className="absolute -top-4 -right-8 hidden xl:block">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary text-[10px] font-bold shadow-inner ring-1 ring-primary/30 backdrop-blur-sm dark:bg-primary/20 dark:ring-primary/40">β</span>
              </FloatingIcon>
            </Link>
            {headlineIsFuture ? (
              <h1 className="text-3xl font-bold leading-tight tracking-tight">
                <Typewriter text={title} speed={42} />
              </h1>
            ) : (
              <h1 className="text-3xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
            )}
            <p className="text-muted-foreground max-w-sm leading-relaxed fadeInUp-[0.4s]">{subtitle}</p>
          </header>
          {updates.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pr-2">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Recent & Upcoming</h2>
                {useCarousel && <span className="text-[10px] text-muted-foreground/70">Auto-rotating</span>}
              </div>
              {useCarousel ? (
                <UpdatesCarousel items={updates} />
              ) : (
                <StaggerUpdatesList items={topHighlight} />
              )}
            </div>
          )}
          <div className="mt-auto pt-8 text-xs text-muted-foreground/80 flex flex-col gap-2">
            <p>&copy; {new Date().getFullYear()} Envoyou. All rights reserved.</p>
            <p className="flex flex-wrap gap-3">
              <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
              <Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link>
              <Link href="/status" className="hover:text-primary transition-colors">Status</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right / Form Area */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-8 lg:px-14 relative">
        {/* Light mode subtle radial using surface token; dark stays transparent (accent handled globally) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,hsl(var(--surface)/0.9),hsl(var(--surface)/0.92)_45%,hsl(var(--surface)/0.86))] dark:bg-transparent pointer-events-none" aria-hidden="true" />
        {/* Grid overlay: token-based so it adapts to theme */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(to_right,hsl(var(--background))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--background))_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,hsl(var(--foreground)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.28)_1px,transparent_1px)] bg-[size:40px_40px] dark:mix-blend-overlay" aria-hidden="true" />
        <div className="w-full max-w-md mx-auto relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthSplitLayout