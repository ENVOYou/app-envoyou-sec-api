'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Key, 
  Calculator,
  TrendingUp,
  Settings,
  User,
  CreditCard,
  SidebarOpen,
  SidebarClose
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'SEC Calculator', href: '/dashboard/sec-calculator', icon: Calculator },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  className?: string
}

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps = {}) {
  const pathname = usePathname()

  return (
    <div 
      className={`hidden lg:block fixed inset-y-0 left-0 z-30 ${collapsed ? 'w-16' : 'w-64'} border-r border-border transition-all duration-300 ${className || ''}`}
      style={{ backgroundColor: 'hsl(var(--secondary))' }}
    >
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        {!collapsed && <h1 className="text-xl font-semibold">Envoyou</h1>}
        <button
          onClick={onToggle}
          className="hidden lg:block p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {collapsed ? <SidebarOpen className="h-6 w-6" /> : <SidebarClose className="h-6 w-6" />}
        </button>
      </div>
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon 
                className={`${collapsed ? 'h-7 w-7' : 'h-5 w-5'} flex-shrink-0`} 
                width={collapsed ? 28 : 20}
                height={collapsed ? 28 : 20}
                strokeWidth={1.75}
/>
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}