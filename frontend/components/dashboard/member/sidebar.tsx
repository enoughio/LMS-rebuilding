"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Calendar,
  Home,
  Library,
  MessageSquare,
  Settings,
  Star,
} from 'lucide-react'

const menuItems = [
  { name: 'Overview', href: '/dashboard/member', icon: Home },
  { name: 'Book Seat', href: '/dashboard/member/book-seat', icon: Calendar },
  { name: 'My Books', href: '/dashboard/member/books', icon: BookOpen },
  { name: 'Libraries', href: '/dashboard/member/libraries', icon: Library },
  { name: 'Forum', href: '/dashboard/member/forum', icon: MessageSquare },
  { name: 'Reviews', href: '/dashboard/member/reviews', icon: Star },
  { name: 'Settings', href: '/dashboard/member/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-bold text-primary">LMS</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
} 