"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Armchair,
  BarChart3,
  Bell,
  BookOpen,
  Building,
  CreditCard,
  LayoutDashboard,
  Library,
  LogOut,  // Settings,
  User,
  Users,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/context/AuthContext"
// import { useAuth } from "@/lib/auth-provider"
// import { ModeToggle } from "@/components/mode-toggle"

export function DashboardSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!user) return []

    if (user.role === "MEMBER") {
      return [
        {
          href: "/dashboard/member",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          active: pathname === "/dashboard/member",
        },
        {
          href: "/dashboard/member/book-seat",
          label: "Book Seat",
          icon: <Building className="h-4 w-4" />,
          active: pathname === "/dashboard/member/book-seat",
        },
        {
          href: "/dashboard/member/e-library",
          label: "E-Library",
          icon: <BookOpen className="h-4 w-4" />,
          active: pathname === "/dashboard/member/e-library",
        },
        {
          href: "/dashboard/member/study-tools",
          label: "Study Tools",
          icon: <BarChart3 className="h-4 w-4" />,
          active: pathname.startsWith("/dashboard/member/study-tools"),
        },
        {
          href: "/dashboard/member/membership",
          label: "Membership",
          icon: <Users className="h-4 w-4" />,
          active: pathname === "/dashboard/member/membership",
        },
        {
          href: "/dashboard/member/profile",
          label: "Profile",
          icon: <User className="h-4 w-4" />,
          active: pathname === "/dashboard/member/profile",
        },
      ]
    } else if (user.role === "ADMIN") {
      return [
        {
          href: "/dashboard/admin",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          active: pathname === "/dashboard/admin",
        },
        {
          href: "/dashboard/admin/library-profile",
          label: "Library Profile",
          icon: <Library className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/library-profile",
        },
        {
          href: "/dashboard/admin/seats",
          label: "Seats",
          icon: <Armchair className="h-4 w-4" />,
          active: pathname.startsWith("/dashboard/admin/seats"),
        },
        {
          href: "/dashboard/admin/seat-types",
          label: "Seat Types",
          icon: <Building className="h-4 w-4" />,
          active: pathname.startsWith("/dashboard/admin/seat-types"),
        },
        {
          href: "/dashboard/admin/membership",
          label: "Membership",
          icon: <Users className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/membership",
        },
        {
          href: "/dashboard/admin/seat-booking",
          label: "Seat Booking",
          icon: <Building className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/seat-booking",
        },
        {
          href: "/dashboard/admin/inventory",
          label: "Inventory",
          icon: <BookOpen className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/inventory",
        },
        {
          href: "/dashboard/admin/payments",
          label: "Payments",
          icon: <CreditCard className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/payments",
        },
        {
          href: "/dashboard/admin/maintenance",
          label: "Maintenance",
          icon: <Wrench className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/maintenance",
        },
        {
          href: "/dashboard/admin/notifications",
          label: "Notifications",
          icon: <Bell className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/notifications",
        },
        {
          href: "/dashboard/admin/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />,
          active: pathname === "/dashboard/admin/reports",
        },
      ]
    } else if (user.role === "SUPER_ADMIN") {
      return [
        {
          href: "/dashboard/super_admin",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          active: pathname === "/dashboard/super_admin",
        },
        {
          href: "/dashboard/super_admin/libraries",
          label: "Libraries",
          icon: <Library className="h-4 w-4" />,
          active: pathname === "/dashboard/super_admin/libraries",
        },
        {
          href: "/dashboard/super_admin/users",
          label: "Users",
          icon: <Users className="h-4 w-4" />,
          active: pathname === "/dashboard/super_admin/users",
        },
        {
          href: "/dashboard/super_admin/payments",
          label: "Payments",
          icon: <CreditCard className="h-4 w-4" />,
          active: pathname === "/dashboard/super_admin/payments",
        },
        {
          href: "/dashboard/super_admin/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />,
          active: pathname === "/dashboard/super_admin/reports",
        },
        // {
        //   href: "/dashboard/super_admin/settings",
        //   label: "Settings",
        //   icon: <Settings className="h-4 w-4" />,
        //   active: pathname === "/dashboard/super_admin/settings",
        // },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  return (
    <div className="hidden border-r bg-background md:block md:w-64 p-4 rounded-r-4xl bg-black text-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">LibraryHub</span>
        </Link>
      </div>
      <div className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Button key={item.href} variant={item.active ? "default" : "ghost"} asChild className="justify-start">
            <Link href={item.href}>
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* <ModeToggle /> */}
            <Link   href="/auth/logout" className="p-2 rounded hover:bg-muted">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
