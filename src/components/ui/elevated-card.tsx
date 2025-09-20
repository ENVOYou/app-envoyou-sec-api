import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import React from 'react'

interface ElevatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean
}

// Combines gradient glow wrapper + card styling used on auth pages
export const ElevatedCard = ({ className, children, hoverGlow = true, ...props }: ElevatedCardProps) => {
  return (
    <div className={cn('relative group', className)} {...props}>
      {/* Light mode: remove colored glow; Dark mode: keep subtle gradient accent */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -inset-0.5 rounded-2xl transition-opacity pointer-events-none',
          'hidden dark:block dark:bg-[radial-gradient(circle_at_30%_20%,rgba(80,220,150,0.18),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(120,200,255,0.15),transparent_65%)]',
          hoverGlow ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
      />
      <div className="relative motion-safe:animate-[fadeInUp_0.5s_ease]">
        <Card className="relative rounded-3xl border border-[oklch(var(--color-border)/0.55)] dark:border-[oklch(var(--color-border)/0.4)] bg-[oklch(var(--color-card)/0.94)] dark:bg-[oklch(var(--color-card)/0.78)] backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.12),0_14px_36px_-10px_rgba(0,0,0,0.16)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.45),0_6px_18px_-2px_rgba(0,0,0,0.5),0_24px_60px_-14px_rgba(0,0,0,0.6)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[oklch(var(--color-border)/0.65)] dark:ring-[oklch(var(--color-border)/0.4)] ring-inset" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
