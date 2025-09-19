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
      <div className="relative">
        <Card className="relative rounded-2xl border border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_32px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.6),0_2px_8px_-2px_rgba(0,0,0,0.4)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-border/60 ring-inset" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl [mask:linear-gradient(to_bottom,black,transparent)] opacity-[0.35] bg-gradient-to-b from-white/60 dark:from-white/10 to-transparent" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
