import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]",
  {
    variants: {
      variant: {
  default: "bg-primary text-primary-foreground shadow-card hover:bg-primary/90 hover:shadow-cardDark",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-borderBase/60 bg-surface/50 hover:bg-surfaceStrong/70 text-foreground",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/80",
  ghost: "hover:bg-accent/50 text-foreground",
  link: "underline-offset-4 hover:underline text-primary",
  social: "bg-surface border border-borderBase/50 dark:bg-surface/70 hover:bg-accent/40 text-foreground shadow-sm hover:shadow-card transition-colors",
  elevated: "relative overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-card hover:shadow-cardDark transition-all duration-200 hover:scale-[1.03] active:scale-95 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_25%_20%,hsl(var(--primary)/0.25),transparent_65%)] dark:before:bg-[radial-gradient(circle_at_30%_25%,hsl(var(--primary)/0.18),transparent_65%)] before:pointer-events-none"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }