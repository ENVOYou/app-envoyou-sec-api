import { cn } from '@/lib/utils'
// DEPRECATION NOTICE:
// DepthCard will be phased out in favor of the unified Card component + section layering.
// New work should prefer <Card variant="base|raised|strong" /> wrapped by .surface-section
// plus optional utilities (.hover-lift, .action-tile, accent overlays). Migrate gradually
// by mapping:
// depth sm -> Card base, md -> Card raised, lg/xl -> Card strong (with accent wrapper),
// glow -> Card strong + custom glow utility.
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

// Dark mode background layering per depth (progressively lighter / more opaque)
const darkBgMap: Record<NonNullable<DepthCardProps['depth']>, string> = {
  sm: 'dark:bg-surface/65',      // lowest elevation uses base surface
  md: 'dark:bg-surfaceAlt/70',   // mid uses new alt layer
  lg: 'dark:bg-surfaceAlt/80',   // strong emphasis slightly more solid
  xl: 'dark:bg-surface-strong/82',
  glow: 'dark:bg-surface-strong/88'
}

export const DepthCard = React.forwardRef<HTMLDivElement, DepthCardProps>(function DepthCard(
  { className, children, accent = 'none', interactive = true, glow = false, density = 'base', depth = 'md', ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
  'relative rounded-3xl border border-borderBase/55 dark:border-borderBase/35 bg-surface/90 dark:bg-surface/70 backdrop-blur-sm transition-all duration-400',
  darkBgMap[depth],
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
