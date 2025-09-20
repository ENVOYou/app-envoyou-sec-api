import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-2xl border border-white/20 dark:border-white/10 bg-white/90 dark:bg-neutral-950/80 text-card-foreground",
      "shadow-[0_4px_12px_rgba(0,0,0,0.15),0_8px_24px_-4px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.6),0_2px_8px_-2px_rgba(0,0,0,0.5)]",
      "backdrop-blur-sm transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2),0_12px_40px_-6px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.7),0_4px_16px_-4px_rgba(0,0,0,0.6)]",
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