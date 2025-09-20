import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div
      className={cn(
        // Light mode: pure white surface, soft border, subtle natural shadow
  "relative rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[linear-gradient(to_bottom_right,rgba(34,34,36,0.8),rgba(28,28,30,0.65))] overflow-hidden",
  "shadow-[0_2px_4px_rgba(0,0,0,0.06),0_6px_16px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_26px_-6px_rgba(0,0,0,0.55),0_4px_12px_-4px_rgba(0,0,0,0.45)]",
  "transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_4px_10px_rgba(0,0,0,0.10),0_10px_28px_-6px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_10px_34px_-6px_rgba(0,0,0,0.6),0_6px_18px_-4px_rgba(0,0,0,0.5)]",
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