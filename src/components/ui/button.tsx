import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:translate-y-[1px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow transition-shadow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        social: "border border-border/70 bg-[linear-gradient(to_bottom,theme(colors.card)_0%,theme(colors.muted)/40_100%)] dark:bg-[linear-gradient(to_bottom,theme(colors.card)_0%,theme(colors.muted)/10_100%)] hover:border-border hover:bg-accent/40 shadow-sm hover:shadow transition-all duration-200",
        elevated: "relative overflow-hidden rounded-lg bg-[linear-gradient(to_right,oklch(var(--color-primary)/0.95),oklch(var(--color-primary)/0.8))] text-primary-foreground shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.035] active:scale-95 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,white/30,transparent_60%)] dark:before:bg-[radial-gradient(circle_at_20%_20%,white/10,transparent_60%)] before:opacity-40 before:pointer-events-none"
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