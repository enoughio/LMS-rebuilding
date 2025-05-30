"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  BookOpen,
  Building,
  CreditCard,
  Home,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/AuthContext" 
import { useToast } from "@/components/ui/use-toast"
// import { ModeToggle } from "@/components/mode-toggle"

interface DashboardSidebarProps {
  children: React.ReactNode
}

export function DashboardSidebar({ children }: DashboardSidebarProps) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const pathname = usePathname() || ""

  // Handle logout with toast notification
  const handleLogout = async () => {
   logout()
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!user) return []

    // Normalize user role to match frontend component expectations
    const userRole = user?.role?.toLowerCase()

    if (userRole === "SUPER_ADMIN" || userRole === "logged_in") {
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
    } else if (userRole === "ADMIN") {
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
    } else if (userRole === "SUPER_ADMIN" || userRole === "SUPER_ADMIN") {
      return [
        {
          href: "/dashboard/super-admin",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin",
        },
        {
          href: "/dashboard/super-admin/libraries",
          label: "Libraries",
          icon: <Library className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin/libraries",
        },
        {
          href: "/dashboard/super-admin/users",
          label: "Users",
          icon: <Users className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin/users",
        },
        {
          href: "/dashboard/super-admin/payments",
          label: "Payments",
          icon: <CreditCard className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin/payments",
        },
        {
          href: "/dashboard/super-admin/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin/reports",
        },
        {
          href: "/dashboard/super-admin/settings",
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
          active: pathname === "/dashboard/super-admin/settings",
        },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen ">
        <Sidebar >
          <SidebarHeader className="border-b px-6 py-3 mt-16">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold">Students Adda</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
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
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
