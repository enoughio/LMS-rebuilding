import { BarChart3, BookOpen,  CreditCard,  LayoutDashboard, Library,  Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ]

  const getNavItems = () => {
    // if (!user) return []

  //   if (user.role === "MEMBER") {
  //     return [
  //       {
  //         href: "/dashboard/member",
  //         title: "Dashboard",
  //         icon: <LayoutDashboard className="h-4 w-4" />,
          // active: pathname === "/dashboard/member",
  //       },
  //       {
  //         href: "/dashboard/member/book-seat",
  //         title: "Book Seat",
  //         icon: <Building className="h-4 w-4" />,
          // active: pathname === "/dashboard/member/book-seat",
  //       },
  //       {
  //         href: "/dashboard/member/e-library",
  //         title: "E-Library",
  //         icon: <BookOpen className="h-4 w-4" />,
          // active: pathname === "/dashboard/member/e-library",
  //       },
  //       {
  //         href: "/dashboard/member/study-tools",
  //         title: "Study Tools",
  //         icon: <BarChart3 className="h-4 w-4" />,
          // active: pathname.startsWith("/dashboard/member/study-tools"),
  //       },
  //       {
  //         href: "/dashboard/member/membership",
  //         title: "Membership",
  //         icon: <Users className="h-4 w-4" />,
          // active: pathname === "/dashboard/member/membership",
  //       },
  //       {
  //         href: "/dashboard/member/profile",
  //         title: "Profile",
  //         icon: <User className="h-4 w-4" />,
          // active: pathname === "/dashboard/member/profile",
  //       },
  //     ]
  //  } else if (user.role === "ADMIN" ) {
  //     return [
  //       {
  //         href: "/dashboard/admin",
  //         title: "Dashboard",
  //         icon: <LayoutDashboard className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin",
  //       },
  //       {
  //         href: "/dashboard/admin/library-profile",
  //         title: "Library Profile",
  //         icon: <Library className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/library-profile",
  //       },
  //       {
  //         href: "/dashboard/admin/membership",
  //         title: "Membership",
  //         icon: <Users className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/membership",
  //       },
  //       {
  //         href: "/dashboard/admin/seat-booking",
  //         title: "Seat Booking",
  //         icon: <Building className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/seat-booking",
  //       },
  //       {
  //         href: "/dashboard/admin/inventory",
  //         title: "Inventory",
  //         icon: <BookOpen className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/inventory",
  //       },
  //       {
  //         href: "/dashboard/admin/payments",
  //         title: "Payments",
  //         icon: <CreditCard className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/payments",
  //       },
  //       {
  //         href: "/dashboard/admin/notifications",
  //         title: "Notifications",
  //         icon: <Bell className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/notifications",
  //       },
  //       {
  //         href: "/dashboard/admin/reports",
  //         title: "Reports",
  //         icon: <BarChart3 className="h-4 w-4" />,
          // active: pathname === "/dashboard/admin/reports",
  //       },
  //     ]
    // } else
    //  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role === "MEMBER") {
      return [
        {
          href: "/dashboard/super-admin",
          title: "Dashboard",
          icon: <LayoutDashboard className="h-4 w-4" />,
          // active: pathname === "/dashboard/super-admin",
        },
        {
          href: "/dashboard/super-admin/libraries",
          label: "Libraries",
          icon: <Library className="h-4 w-4" />,
          // active: pathname === "/dashboard/super-admin/libraries",
        },
        {
          href: "/dashboard/super-admin/users",
          label: "Users",
          icon: <Users className="h-4 w-4" />,
          // active: pathname === "/dashboard/super-admin/users",
        },
        {
          href: "/dashboard/super-admin/payments",
          label: "Payments",
          icon: <CreditCard className="h-4 w-4" />,
          // active: pathname === "/dashboard/super-admin/payments",
        },
        {
          href: "/dashboard/super-admin/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />
          // active: pathname === "/dashboard/super-admin/reports",
        },
        {
          href: "/dashboard/super-admin/settings",
          title: "Settings",
          icon: <Settings className="h-4 w-4" />
          // active: pathname === "/dashboard/super-admin/settings",
        },
      ]
    }

    // return []
  // }

  const items = getNavItems()


export function AppSidebar() {
  return (
    <Sidebar className="pt-16 flex min-h-screen">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/" className="flex items-center gap-2 my-5">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">StudentsAdda</span>
        </Link>

          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}