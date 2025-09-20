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
        <Card className="relative rounded-3xl border border-gray-200 bg-white dark:!bg-white dark:!bg-none dark:border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-6px_rgba(0,0,0,0.10)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_8px_24px_-6px_rgba(0,0,0,0.10)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-200/60 dark:ring-gray-200/60 ring-inset" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
