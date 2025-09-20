"use client";

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[40%] opacity-60 mix-blend-screen dark:mix-blend-overlay blur-3xl will-change-transform animate-[auroraShift_18s_ease-in-out_infinite] bg-[conic-gradient(from_0deg,oklch(var(--color-primary)/0.18)_0deg,transparent_120deg,oklch(var(--color-primary)/0.24)_240deg,transparent_300deg)]" />
    </div>
  )
}

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  loop?: boolean
  className?: string
}

export function Typewriter({ text, speed = 45, delay = 400, loop = false, className }: TypewriterProps) {
  const [display, setDisplay] = useState('')
  const indexRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const tick = () => {
      if (indexRef.current <= text.length) {
        setDisplay(text.slice(0, indexRef.current))
        indexRef.current += 1
        timeoutRef.current = window.setTimeout(tick, speed)
      } else if (loop) {
        timeoutRef.current = window.setTimeout(() => {
          indexRef.current = 0
          setDisplay('')
          tick()
        }, 2200)
      }
    }
    const start = window.setTimeout(tick, delay)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      window.clearTimeout(start)
    }
  }, [text, speed, delay, loop])

  return (
    <span className={className}>
      {display}
      <span className="inline-block w-[3px] h-[1.1em] align-middle translate-y-[1px] ml-[2px] bg-current animate-[caretBlink_1.1s_steps(2,start)_infinite]" />
    </span>
  )
}

interface CarouselItem {
  title: string
  description: string
  date?: string
}

interface UpdatesCarouselProps {
  items: CarouselItem[]
  interval?: number
  className?: string
  pauseOnHover?: boolean
  ariaLabel?: string
}

export function UpdatesCarousel({ items, interval = 5000, className, pauseOnHover = true, ariaLabel = 'Updates carousel' }: UpdatesCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const active = items[index]

  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => {
      setIndex(i => (i + 1) % items.length)
    }, interval)
    return () => window.clearTimeout(id)
  }, [index, paused, items.length, interval])

  return (
    <div
      className={className}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div className="sr-only" aria-live="polite">{active.title}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.35, ease: 'easeIn' } }}
          className="space-y-2"
        >
          <h3 className="text-base font-semibold leading-snug tracking-tight">{active.title}</h3>
          {active.date && <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{active.date}</p>}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{active.description}</p>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="flex gap-2 mt-4 items-center">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show update ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${i === index ? 'w-6 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setPaused(p => !p)}
            className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            aria-label={paused ? 'Resume carousel' : 'Pause carousel'}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  )
}

interface StaggerListProps {
  items: CarouselItem[]
  className?: string
  delayPerItem?: number
}

export function StaggerUpdatesList({ items, className, delayPerItem = 90 }: StaggerListProps) {
  return (
    <ul className={className}>
      {items.map((u, i) => (
        <motion.li
          key={u.title + i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut', delay: 0.25 + i * (delayPerItem / 1000) } }}
          className="group relative pl-4"
        >
          <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
          <p className="font-medium leading-snug group-hover:text-primary transition-colors">{u.title}</p>
          {u.date && <p className="text-[10px] uppercase tracking-wider text-muted-foreground/80 mt-1">{u.date}</p>}
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{u.description}</p>
        </motion.li>
      ))}
    </ul>
  )
}

export function FloatingIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-[floatPulse_7s_ease-in-out_infinite] will-change-transform ${className}`}>{children}</div>
  )
}
