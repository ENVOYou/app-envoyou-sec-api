import { cn } from '@/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => (
  <div
      className={cn(
            "relative rounded-xl border border-border/60 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.96),rgba(255,255,255,0.90))] dark:bg-[linear-gradient(to_bottom_right,rgba(30,30,32,0.75),rgba(30,30,32,0.55))] backdrop-blur-sm overflow-hidden transition-colors",
        // Base shadow (balanced, subtle depth)
        "shadow-[0_4px_10px_-2px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6),0_4px_10px_-4px_rgba(0,0,0,0.5)]",
        // Hover elevation
        "transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.18),0_14px_42px_-8px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_10px_32px_-6px_rgba(0,0,0,0.7),0_6px_18px_-4px_rgba(0,0,0,0.55)]",
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