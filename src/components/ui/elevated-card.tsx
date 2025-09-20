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
      <div
        aria-hidden="true"
        className={cn(
          'absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent transition-opacity',
          hoverGlow ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
      />
      <div className="relative motion-safe:animate-[fadeInUp_0.5s_ease]">
            <Card className="relative rounded-3xl border border-white/40 dark:border-white/5 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.96),rgba(255,255,255,0.90))] dark:bg-[linear-gradient(to_bottom_right,rgba(30,30,32,0.75),rgba(30,30,32,0.55))] backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_4px_18px_-2px_rgba(0,0,0,0.12),0_10px_44px_-6px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_40px_-8px_rgba(0,0,0,0.75),0_4px_16px_-4px_rgba(0,0,0,0.55)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/60 ring-inset" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask:linear-gradient(to_bottom,black,transparent)] opacity-[0.35] bg-gradient-to-b from-white/60 dark:from-white/10 to-transparent" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
