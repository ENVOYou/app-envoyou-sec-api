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
          'absolute -inset-0.5 rounded-2xl transition-opacity',
          'dark:bg-gradient-to-br dark:from-primary/15 dark:via-accent/10 dark:to-transparent',
          hoverGlow ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
      />
      <div className="relative motion-safe:animate-[fadeInUp_0.5s_ease]">
        <Card className="relative rounded-3xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[linear-gradient(to_bottom_right,rgba(40,40,42,0.85),rgba(30,30,32,0.65))] shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-6px_rgba(0,0,0,0.10)] dark:shadow-[0_10px_34px_-6px_rgba(0,0,0,0.55),0_4px_14px_-4px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-200/60 dark:ring-white/10 ring-inset" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
