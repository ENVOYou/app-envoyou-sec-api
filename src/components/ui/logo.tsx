"use client";
import { EnvoyouIcon } from '@/components/icons/EnvoyouIcon';
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

export function Logo({ size = 40, className, withWordmark = false, wordmarkClassName }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      <EnvoyouIcon 
        width={size} 
        height={size} 
        className="text-foreground drop-shadow-sm" // <-- Warna diatur di sini
      />
      {withWordmark && (
        <span className={cn('font-semibold tracking-tight text-lg', wordmarkClassName)}>Envoyou</span>
      )}
    </div>
  )
}

export default Logo
