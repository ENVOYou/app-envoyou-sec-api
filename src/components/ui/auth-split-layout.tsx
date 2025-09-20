"use client"

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

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
  return (
    <div className={cn('min-h-screen grid lg:grid-cols-2 bg-background text-foreground', className)}>
      {/* Left / Branding Panel */}
      <div className="relative hidden lg:flex flex-col overflow-hidden border-r border-border/60 bg-gradient-to-br from-accent/40 via-transparent to-primary/10">
        <div className="absolute inset-0 pointer-events-none [mask:radial-gradient(circle_at_30%_30%,black,transparent)]" />
        <div className="relative z-10 flex flex-col h-full p-12 gap-12">
          <header className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-lg bg-primary/90 flex items-center justify-center shadow-sm ring-1 ring-inset ring-white/20 dark:ring-black/40">
                <span className="font-bold text-primary-foreground text-lg">E</span>
              </div>
              <span className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">Envoyou</span>
            </Link>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
            <p className="text-muted-foreground max-w-sm leading-relaxed">{subtitle}</p>
          </header>
          {updates.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Recent & Upcoming</h2>
              <ul className="space-y-5">
                {updates.map((u, i) => (
                  <li key={i} className="group relative pl-4">
                    <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors" />
                    <p className="font-medium leading-snug group-hover:text-primary transition-colors">{u.title}</p>
                    {u.date && <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80 mt-1">{u.date}</p>}
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{u.description}</p>
                  </li>
                ))}
              </ul>
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
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-14 relative">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthSplitLayout