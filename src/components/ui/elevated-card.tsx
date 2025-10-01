import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import React from 'react'

interface ElevatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean
}

// Combines gradient glow wrapper + card styling used on auth pages
export const ElevatedCard = ({ className, children, hoverGlow = true, ...props }: ElevatedCardProps) => {
  return (
    <div className={`w-6 h-6 ${className}`} {...props}>
      {/* Light mode: remove colored glow; Dark mode: keep subtle gradient accent */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute -inset-0.5 rounded-2xl transition-opacity pointer-events-none',
          'hidden dark:block dark:bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_60%),radial-gradient(circle_at_75%_70%,hsl(var(--accent)/0.15),transparent_65%)]',
          hoverGlow ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
      />
      <div className="relative motion-safe:animate-[fadeInUp_0.5s_ease]">
        <Card variant="strong" className="rounded-3xl border border-borderBase/55 dark:border-borderBase/35">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-borderBase/65 dark:ring-borderBase/40 ring-inset" aria-hidden="true" />
          {children}
        </Card>
      </div>
    </div>
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
