"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { AuroraBackground, Typewriter, StaggerUpdatesList, UpdatesCarousel, FloatingIcon } from './auth-animations'

interface AuthSplitLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  updates?: { title: string; description: string; date?: string }[]
  className?: string
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
  className
}: AuthSplitLayoutProps) {
  const headlineIsFuture = /soon|coming|realtime|real-time|future|next/i.test(title)
  const useCarousel = updates.length > 3
  const topHighlight = useMemo(() => updates.slice(0, 3), [updates])
  return (
    <div className={cn('min-h-screen grid lg:grid-cols-2 bg-gradient-to-tr from-background via-background to-card/60 text-foreground relative', className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,oklch(var(--color-primary)/0.15),transparent_60%)]" />
      {/* Left / Branding Panel */}
      <div className="relative hidden lg:flex flex-col overflow-hidden border-r border-border/60 bg-gradient-to-br from-accent/40 via-transparent to-primary/10">
        <AuroraBackground />
        <div className="absolute inset-0 pointer-events-none [mask:radial-gradient(circle_at_30%_30%,black,transparent)]" />
        <div className="relative z-10 flex flex-col h-full p-12 gap-12">
          <header className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-lg bg-primary/90 flex items-center justify-center shadow-sm ring-1 ring-inset ring-white/20 dark:ring-black/40">
                <span className="font-bold text-primary-foreground text-lg">E</span>
              </div>
              <span className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors relative">
                Envoyou
                <FloatingIcon className="absolute -top-5 -right-6 hidden xl:block">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-primary text-[10px] font-bold shadow-inner ring-1 ring-primary/40 backdrop-blur-sm">
                    β
                  </span>
                </FloatingIcon>
              </span>
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
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:40px_40px] mix-blend-overlay" />
        <div className="w-full max-w-md mx-auto relative">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthSplitLayout