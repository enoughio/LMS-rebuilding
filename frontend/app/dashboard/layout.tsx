// // import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// // import { AppSidebar } from "@/components/app-sidebar"

// // export default function Layout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <SidebarProvider>
// //       <AppSidebar />
// //       <main>
// //         <SidebarTrigger />
// //         {children}
// //       </main>
// //     </SidebarProvider>
// //   )
// // }

// // import type React from "react"
// // import { DashboardSidebar } from "@/components/dashboard/sidebar"

// // export default function DashboardLayout({ children }: { children: React.ReactNode }) {
// //   return (
// //     <div className="flex min-h-screen">
// //       <DashboardSidebar />
// //       <div className="flex-1 overflow-auto">
// //         <main className="w-full p-6">{children}</main>
// //       </div>
// //     </div>
// //   )
// // }

// // layout.tsx
// "use client"

// import type React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//   BarChart3,
//   Bell,
//   BookOpen,
//   Building,
//   CreditCard,
//   LayoutDashboard,
//   Library,
//   LogOut,
//   Settings,
//   User,
//   Users,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useAuth } from "@/lib/context/AuthContext"

// // Dashboard Sidebar Component
// function DashboardSidebar() {
//   const { user, logout } = useAuth()
//   const pathname = usePathname()

//   // Define navigation items based on user role
//   const getNavItems = () => {
//     if (!user) return []

//   //   if (user.role ==="MEMBER") {
//   //     return [
//   //       {
//   //         href: "/dashboard/member",
//   //         label: "Dashboard",
//   //         icon: <LayoutDashboard className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/member",
//   //       },
//   //       {
//   //         href: "/dashboard/member/book-seat",
//   //         label: "Book Seat",
//   //         icon: <Building className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/member/book-seat",
//   //       },
//   //       {
//   //         href: "/dashboard/member/e-library",
//   //         label: "E-Library",
//   //         icon: <BookOpen className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/member/e-library",
//   //       },
//   //       {
//   //         href: "/dashboard/member/study-tools",
//   //         label: "Study Tools",
//   //         icon: <BarChart3 className="h-4 w-4" />,
//   //         active: pathname.startsWith("/dashboard/member/study-tools"),
//   //       },
//   //       {
//   //         href: "/dashboard/member/membership",
//   //         label: "Membership",
//   //         icon: <Users className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/member/membership",
//   //       },
//   //       {
//   //         href: "/dashboard/member/profile",
//   //         label: "Profile",
//   //         icon: <User className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/member/profile",
//   //       },
//   //     ]
//   //  } else if (user.role === "ADMIN" ) {
//   //     return [
//   //       {
//   //         href: "/dashboard/admin",
//   //         label: "Dashboard",
//   //         icon: <LayoutDashboard className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/library-profile",
//   //         label: "Library Profile",
//   //         icon: <Library className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/library-profile",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/membership",
//   //         label: "Membership",
//   //         icon: <Users className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/membership",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/seat-booking",
//   //         label: "Seat Booking",
//   //         icon: <Building className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/seat-booking",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/inventory",
//   //         label: "Inventory",
//   //         icon: <BookOpen className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/inventory",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/payments",
//   //         label: "Payments",
//   //         icon: <CreditCard className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/payments",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/notifications",
//   //         label: "Notifications",
//   //         icon: <Bell className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/notifications",
//   //       },
//   //       {
//   //         href: "/dashboard/admin/reports",
//   //         label: "Reports",
//   //         icon: <BarChart3 className="h-4 w-4" />,
//   //         active: pathname === "/dashboard/admin/reports",
//   //       },
//   //     ]
//     // } else
//      if (user.role === "SUPER_ADMIN" || user.role === "ADMIN" || user.role ==="MEMBER") {
//       return [
//         {
//           href: "/dashboard/SUPER_ADMIN",
//           label: "Dashboard",
//           icon: <LayoutDashboard className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/libraries",
//           label: "Libraries",
//           icon: <Library className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN/libraries",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/users",
//           label: "Users",
//           icon: <Users className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN/users",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/payments",
//           label: "Payments",
//           icon: <CreditCard className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN/payments",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/reports",
//           label: "Reports",
//           icon: <BarChart3 className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN/reports",
//         },
//         {
//           href: "/dashboard/SUPER_ADMIN/settings",
//           label: "Settings",
//           icon: <Settings className="h-4 w-4" />,
//           active: pathname === "/dashboard/SUPER_ADMIN/settings",
//         },
//       ]
//     }

//     return []
//   }

//   const navItems = getNavItems()

//   return (
//     <div className="hidden border-r bg-background md:block md:w-64">
//       <div className="flex h-14 items-center border-b px-4">
//         <Link href="/" className="flex items-center gap-2">
//           <BookOpen className="h-6 w-6" />
//           <span className="font-bold">LibraryHub</span>
//         </Link>
//       </div>
//       <div className="flex flex-col gap-1 p-4">
//         {navItems.map((item) => (
//           <Button key={item.href} variant={item.active ? "default" : "ghost"} asChild className="justify-start">
//             <Link href={item.href}>
//               {item.icon}
//               <span className="ml-2">{item.label}</span>
//             </Link>
//           </Button>
//         ))}
//       </div>
//       <div className="mt-auto border-t p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || ""} />
//               <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <span className="text-sm font-medium">{user?.name}</span>
//               <span className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="icon" onClick={logout} title="Logout">
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Dashboard Layout Component
// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex w-full min-h-screen justify-start">
//       <DashboardSidebar />
//       <div className="flex  overflow-auto">
//         <main className="w-full  p-6">{children}</main>
//       </div>
//     </div>
//   )
// }

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return (
    
//       <SidebarProvider>
//         <AppSidebar />
//         <main >
//           <SidebarTrigger />
//           {children}
//         </main>
//       </SidebarProvider>

//   );
// }



import type React from "react"
import { DashboardSidebar } from "@/components/app-sidebar" 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <main className="w-full px-6">{children}</main>
      </div>
    </div>
  )
}