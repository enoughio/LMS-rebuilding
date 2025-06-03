// import { BarChart3, BookOpen,  CreditCard,  LayoutDashboard, Library,  Settings, Users } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import Link from "next/link"

// // Menu items.
// // const items = [
// //   {
// //     title: "Home",
// //     url: "#",
// //     icon: Home,
// //   },
// //   {
// //     title: "Inbox",
// //     url: "#",
// //     icon: Inbox,
// //   },
// //   {
// //     title: "Calendar",
// //     url: "#",
// //     icon: Calendar,
// //   },
// //   {
// //     title: "Search",
// //     url: "#",
// //     icon: Search,
// //   },
// //   {
// //     title: "Settings",
// //     url: "#",
// //     icon: Settings,
// //   },
// // ]

//   const getNavItems = () => {
//     // if (!user) return []

//   //   if (user.role ==="MEMBER") {
//   //     return [
//   //       {
//   //         href: "/dashboard/member",
//   //         title: "Dashboard",
//   //         icon: <LayoutDashboard className="h-4 w-4" />,
//           // active: pathname === "/dashboard/member",
//   //       },
//   //       {
//   //         href: "/dashboard/member/book-seat",
//   //         title: "Book Seat",
//   //         icon: <Building className="h-4 w-4" />,
//           // active: pathname === "/dashboard/member/book-seat",
//   //       },
//   //       {
//   //         href: "/dashboard/member/e-library",
//   //         title: "E-Library",
//   //         icon: <BookOpen className="h-4 w-4" />,
//           // active: pathname === "/dashboard/member/e-library",
//   //       },
//   //       {
//   //         href: "/dashboard/member/study-tools",
//   //         title: "Study Tools",
//   //         icon: <BarChart3 className="h-4 w-4" />,
//           // active: pathname.startsWith("/dashboard/member/study-tools"),
//   //       },
//   //       {
//   //         href: "/dashboard/member/membership",
//   //         title: "Membership",
//   //         icon: <Users className="h-4 w-4" />,
//           // active: pathname === "/dashboard/member/membership",
//   //       },
//   //       {
//   //         href: "/dashboard/member/profile",
//   //         title: "Profile",
//   //         icon: <User className="h-4 w-4" />,
//           // active: pathname === "/dashboard/member/profile",
//   //       },
//   //     ]
//   //  } else if (user.role === "ADMIN" ) {
//   //     return [
//   //       {
//   //         href: "/dashboard/admin",
//   //         title: "Dashboard",
//   //         icon: <LayoutDashboard className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/library-profile",
//   //         title: "Library Profile",
//   //         icon: <Library className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/library-profile",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/membership",
//   //         title: "Membership",
//   //         icon: <Users className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/membership",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/seat-booking",
//   //         title: "Seat Booking",
//   //         icon: <Building className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/seat-booking",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/inventory",
//   //         title: "Inventory",
//   //         icon: <BookOpen className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/inventory",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/payments",
//   //         title: "Payments",
//   //         icon: <CreditCard className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/payments",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/notifications",
//   //         title: "Notifications",
//   //         icon: <Bell className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/notifications",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/reports",
//   //         title: "Reports",
//   //         icon: <BarChart3 className="h-4 w-4" />,
//           // active: pathname === "/dashboard/admin/reports",
//   //       },
//   //     ]
//     // } else
//     //  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role ==="MEMBER") {
//       return [
//         {
//           href: "/dashboard/SUPER_ADMIN",
//           title: "Dashboard",
//           icon: <LayoutDashboard className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN",
//         },        {
//           href: "/dashboard/SUPER_ADMIN/libraries",
//           title: "Libraries",
//           icon: <Library className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN/libraries",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/users",
//           title: "Users",
//           icon: <Users className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN/users",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/payments",
//           title: "Payments",
//           icon: <CreditCard className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN/payments",
//         },        {
//           href: "/dashboard/SUPER_ADMIN/reports",
//           title: "Reports",
//           icon: <BarChart3 className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN/reports",
//         },        {
//           href: "/dashboard/SUPER_ADMIN/settings",
//           title: "Settings",
//           icon: <Settings className="h-4 w-4" />,
//           // active: pathname === "/dashboard/SUPER_ADMIN/settings",
//         },
//       ]
//     }

//     // return []
//   // }

//   const items = getNavItems()


// export function AppSidebar() {
//   return (
//     <Sidebar className="pt-16 flex min-h-screen">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>
//             <Link href="/" className="flex items-center gap-2 my-5">
//           <BookOpen className="h-6 w-6" />
//           <span className="font-bold">StudentsAdda</span>
//         </Link>

//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.href}>
//                       {item.icon}
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }




"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  BookOpen,
  Building,
  CreditCard,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/context/AuthContext"
// import { useAuth } from "@/lib/auth-provider"
// import { ModeToggle } from "@/components/mode-toggle"

export function DashboardSidebar() {
  const { user, logout } = useAuth()
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
    } else if (user.role === "SUPER_ADMIN") {
      return [
        {
          href: "/dashboard/SUPER_ADMIN",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN",
        },
        {
          href: "/dashboard/SUPER_ADMIN/libraries",
          label: "Libraries",
          icon: <Library className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN/libraries",
        },
        {
          href: "/dashboard/SUPER_ADMIN/users",
          label: "Users",
          icon: <Users className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN/users",
        },
        {
          href: "/dashboard/SUPER_ADMIN/payments",
          label: "Payments",
          icon: <CreditCard className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN/payments",
        },
        {
          href: "/dashboard/SUPER_ADMIN/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN/reports",
        },
        {
          href: "/dashboard/SUPER_ADMIN/settings",
          label: "Settings",
          icon: <Settings className="h-4 w-4" />,
          active: pathname === "/dashboard/SUPER_ADMIN/settings",
        },
      ]
    }

    return []
  }

  const navItems = getNavItems()

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
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
            <Link   href="/" className="p-2 rounded hover:bg-muted">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
