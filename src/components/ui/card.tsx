import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div
      className={cn(
        // Light mode: pure white surface, soft border, subtle natural shadow
  "relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/90 dark:bg-neutral-950/80 backdrop-blur-sm overflow-hidden",
  "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_10px_-2px_rgba(0,0,0,0.10),0_12px_32px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_4px_12px_-2px_rgba(0,0,0,0.45),0_18px_42px_-12px_rgba(0,0,0,0.6)]",
  "transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_6px_16px_-2px_rgba(0,0,0,0.14),0_18px_46px_-12px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_8px_22px_-2px_rgba(0,0,0,0.55),0_26px_58px_-14px_rgba(0,0,0,0.6)]",
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