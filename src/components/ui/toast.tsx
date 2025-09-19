"use client"
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export interface ToastItem {
  id: string
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  push: (toast: Omit<ToastItem, 'id'>) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    const item: ToastItem = { id, variant: 'default', duration: 4000, ...toast }
    setToasts(prev => [...prev, item])
    if (item.duration && item.duration > 0) {
      setTimeout(() => remove(id), item.duration)
    }
  }, [remove])

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed z-[100] bottom-4 right-4 flex flex-col gap-3 w-80">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'border rounded-lg p-4 text-sm shadow-md bg-card/90 backdrop-blur-md relative overflow-hidden group',
              t.variant === 'success' && 'border-green-300 dark:border-green-800',
              t.variant === 'error' && 'border-red-300 dark:border-red-800',
              t.variant === 'warning' && 'border-yellow-300 dark:border-yellow-800'
            )}
          >
            {t.title && <div className="font-medium mb-1">{t.title}</div>}
            <div className="leading-relaxed text-muted-foreground">{t.message}</div>
            <button
              onClick={() => remove(t.id)}
              className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-[shrink_4s_linear]" />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
