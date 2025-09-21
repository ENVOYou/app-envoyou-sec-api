import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'raised' | 'strong'
  interactive?: boolean
}

const tierMap: Record<NonNullable<CardProps['variant']>, string> = {
  base: 'bg-surface/90 dark:bg-surface/80',
  raised: 'bg-surface-alt/92 dark:bg-surfaceAlt/78',
  strong: 'bg-surface-strong/95 dark:bg-surface-strong/82'
}

const Card = ({ className, variant = 'base', interactive = true, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-borderBase/60 dark:border-borderBase/30 backdrop-blur-sm overflow-hidden',
        tierMap[variant],
        'shadow-card dark:shadow-cardDark',
        interactive && 'transition-all duration-300 hover:translate-y-[-3px] hover:shadow-hoverLift dark:hover:shadow-hoverLiftDark',
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