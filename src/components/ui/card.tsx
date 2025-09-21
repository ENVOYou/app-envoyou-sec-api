import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'raised' | 'strong'
  interactive?: boolean
}

const tierMap: Record<NonNullable<CardProps['variant']>, string> = {
  // Base: sits just above canvas; minimal shadow
  base: 'bg-surface/96 dark:bg-surface/88 shadow-elevationSm',
  // Raised: clearer separation using alt tone + mid shadow
  raised: 'bg-surface-alt/96 dark:bg-surfaceAlt/90 shadow-elevationMd relative',
  // Strong: highest panel tier; stronger tone + composite shadow + faint top gradient
  strong: 'bg-surface-strong/98 dark:bg-surface-strong/92 shadow-depth relative'
}

const Card = ({ className, variant = 'base', interactive = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'group rounded-2xl border border-borderBase/55 dark:border-borderBase/30 overflow-hidden backdrop-blur-sm transition-colors',
        tierMap[variant],
        interactive && 'transition-transform duration-300 will-change-transform hover:translate-y-[-3px] hover:shadow-hoverLift dark:hover:shadow-hoverLiftDark',
        variant === 'strong' && 'before:absolute before:inset-0 before:pointer-events-none before:bg-[linear-gradient(to_bottom,hsl(var(--foreground)/0.08),transparent_55%)] before:mix-blend-overlay',
        className
      )}
      {...props}
    />
  )
}

const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

const CardTitle = ({ className, ...props }: CardProps) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
)

const CardDescription = ({ className, ...props }: CardProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }