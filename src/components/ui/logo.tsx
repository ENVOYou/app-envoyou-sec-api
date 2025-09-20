"use client";
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: number
  className?: string
  priority?: boolean
  withWordmark?: boolean
  wordmarkClassName?: string
}

export function Logo({ size = 40, className, priority = false, withWordmark = false, wordmarkClassName }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme === 'dark' : false
  const src = isDark ? '/logo-envoyou/dark-mode.svg' : '/logo-envoyou/light-mode.svg'

  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      <Image
        src={src}
        alt="Envoyou"
        width={size}
        height={size}
        priority={priority}
        className="rounded-md drop-shadow-sm"
      />
      {withWordmark && (
        <span className={cn('font-semibold tracking-tight text-lg', wordmarkClassName)}>Envoyou</span>
      )}
    </div>
  )
}

export default Logo
