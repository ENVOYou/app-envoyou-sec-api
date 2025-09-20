import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-borderBase/55 dark:border-borderBase/35 bg-surface/95 dark:bg-surface/60 px-3 py-2 text-sm ring-offset-background placeholder:text-muted/70 dark:placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/55 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.55)] backdrop-blur-sm transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }