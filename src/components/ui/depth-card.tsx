import { cn } from '@/lib/utils'
import React from 'react'

interface DepthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'primary' | 'accent' | 'none'
  interactive?: boolean
  glow?: boolean
  density?: 'base' | 'compact'
  depth?: 'sm' | 'md' | 'lg' | 'xl' | 'glow'
}

const depthMap: Record<NonNullable<DepthCardProps['depth']>, string> = {
  sm: 'shadow-elevationSm',
  md: 'shadow-depth',
  lg: 'shadow-depthLg',
  xl: 'shadow-depthXl',
  glow: 'shadow-depthGlow'
}

export const DepthCard = React.forwardRef<HTMLDivElement, DepthCardProps>(function DepthCard(
  { className, children, accent = 'none', interactive = true, glow = false, density = 'base', depth = 'md', ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-3xl border border-borderBase/55 dark:border-borderBase/35 bg-surface/90 dark:bg-surface/75 backdrop-blur-sm transition-all duration-400',
        depthMap[depth],
        interactive && 'hover:shadow-depthLg dark:hover:shadow-depthXl hover:translate-y-[-2px]',
        glow && 'before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.18),transparent_60%)]',
        accent === 'primary' && 'layered-surface',
        accent === 'accent' && 'before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.25),transparent_65%)] before:opacity-80 before:pointer-events-none',
        density === 'compact' ? 'p-4' : 'p-6',
        className
      )}
      {...props}
    >
      {/* Inner subtle inset ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-borderBase/40 dark:ring-borderBase/25 ring-inset" />
      {children}
    </div>
  )
})
