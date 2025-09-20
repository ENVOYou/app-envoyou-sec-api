import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div
      className={cn(
        // Light mode: pure white surface, soft border, subtle natural shadow
  "relative rounded-2xl border border-borderBase/60 dark:border-borderBase/30 bg-surface/90 dark:bg-surface/85 backdrop-blur-sm overflow-hidden",
  "shadow-card dark:shadow-cardDark",
  "transition-all duration-300 hover:translate-y-[-3px] hover:shadow-hoverLift dark:hover:shadow-hoverLiftDark",
        className
      )}
    {...props}
  />
)

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