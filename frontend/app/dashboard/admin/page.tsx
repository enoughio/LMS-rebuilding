// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, BookOpen, Clock, DollarSign, Users } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { useAuth } from "@/lib/context/AuthContext" 
// import { AdminDashboardService, type AdminDashboardData } from "@/lib/services/admin-dashboard-service"

// export default function AdminDashboardPage() {
//   const { user } = useAuth()
//   const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       setError(null)
//       try {
//         if (user) {
//           const data = await AdminDashboardService.getDashboardData()
//           setDashboardData(data)
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//         setError(error instanceof Error ? error.message : "Failed to fetch dashboard data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user])

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Admin's Dashboard</h1>
//           <p className="text-muted-foreground">Loading your library overview...</p>
//         </div>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => (
//             <Card key={i}>
//               <CardHeader className="flex flex-row items-center justify-between pb-2">
//                 <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
//                 <div className="h-4 w-4 animate-pulse rounded bg-muted"></div>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-8 w-16 animate-pulse rounded bg-muted mb-2"></div>
//                 <div className="h-3 w-32 animate-pulse rounded bg-muted"></div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Admin's Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here's an overview of your library.</p>
//         </div>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="text-center">
//               <p className="text-red-600 mb-2">Failed to load dashboard data</p>
//               <p className="text-sm text-muted-foreground mb-4">{error}</p>
//               <Button onClick={() => window.location.reload()}>Try Again</Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (!dashboardData) {
//     return null
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-3xl font-bold tracking-tight">Admin's Dashboard</h1>
//         <p className="text-muted-foreground">Welcome back! Here's an overview of your library.</p>
//       </div>      {/* Stats Overview */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Today's bookings</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.todaysBookings.count}</div>
//             <p className="text-xs text-muted-foreground">
//               {dashboardData.todaysBookings.change > 0 ? "+" : ""}
//               {dashboardData.todaysBookings.change} Compared to {dashboardData.todaysBookings.comparedTo}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Active Members</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.activeMembers.count}</div>
//             <p className="text-xs text-muted-foreground">
//               {dashboardData.activeMembers.change > 0 ? "+" : ""}
//               {dashboardData.activeMembers.change} Compared to {dashboardData.activeMembers.comparedTo}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{dashboardData.todaysRevenue.amount.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               {dashboardData.todaysRevenue.change > 0 ? "+" : ""}
//               {dashboardData.todaysRevenue.change} Compared to {dashboardData.todaysRevenue.comparedTo}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Books checked out</CardTitle>
//             <BookOpen className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{dashboardData.booksCheckedOut.count}</div>
//             <p className="text-xs text-muted-foreground">
//               {dashboardData.booksCheckedOut.change > 0 ? "+" : ""}
//               {dashboardData.booksCheckedOut.change} Compared to {dashboardData.booksCheckedOut.comparedTo}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Occupancy Rate */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Occupancy Rate</CardTitle>
//             <CardDescription>Seat occupancy over the past 30 days</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[200px] w-full">
//               {/* This would be a chart in a real implementation */}
//               <div className="flex h-full w-full items-end justify-between gap-2">
//                 {Array.from({ length: 12 }).map((_, i) => {
//                   const height = Math.floor(Math.random() * 80) + 20
//                   return (
//                     <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
//                       <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
//                       <span className="mt-2 text-center text-xs text-muted-foreground">{2016 + i}</span>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           </CardContent>
//         </Card>        {/* Today's Schedule */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Today's schedule</CardTitle>
//             <CardDescription>Current seat occupancy</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Current Occupancy</span>
//                 <span className="text-sm">
//                   {dashboardData.occupancyRate.current}/{dashboardData.occupancyRate.total} seats
//                 </span>
//               </div>
//               <Progress
//                 value={(dashboardData.occupancyRate.current / dashboardData.occupancyRate.total) * 100}
//                 className="h-2"
//               />
//               <div className="rounded-lg border p-4">
//                 <div className="flex items-center gap-4">
//                   <Clock className="h-5 w-5 text-blue-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Today's Bookings</p>
//                     <p className="text-xs text-muted-foreground">Active seat reservations</p>
//                   </div>
//                   <Badge variant="outline">
//                     {dashboardData.occupancyRate.current} active
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="ghost" size="sm" className="w-full" asChild>
//               <Link href="/dashboard/admin/seat-booking">
//                 Manage Bookings
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Recent Member Activity */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Recent Member Activity</CardTitle>
//             <CardDescription>Latest check in and book checkouts</CardDescription>
//           </CardHeader>          <CardContent>
//             <div className="space-y-4">
//               {dashboardData.recentActivity.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-6 text-center">
//                   <p className="text-sm text-muted-foreground">No recent activity</p>
//                 </div>
//               ) : (
//                 dashboardData.recentActivity.map((activity: any) => (
//                   <div key={activity.id} className="flex items-center gap-4">
//                     <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
//                       {activity.avatar ? (
//                         <Image src={activity.avatar} alt={activity.userName} width={40} height={40} />
//                       ) : (
//                         <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
//                           {activity.userName.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium">{activity.userName}</p>
//                       <p className="text-xs text-muted-foreground">Checked in at {activity.time}</p>
//                     </div>
//                     <Badge variant="outline">Seat #{activity.seatName}</Badge>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="ghost" size="sm" className="w-full" asChild>
//               <Link href="/dashboard/admin/seat-booking">
//                 View All Activity
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Inventory Status */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Inventory Status</CardTitle>
//             <CardDescription>Book inventory overview</CardDescription>
//           </CardHeader>          <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <div className="mb-1 flex items-center justify-between">
//                   <span className="text-sm font-medium">Total books</span>
//                   <span className="text-sm font-medium">{dashboardData.inventory.totalBooks}</span>
//                 </div>
//                 <Progress value={100} className="h-2" />
//               </div>
//               <div>
//                 <div className="mb-1 flex items-center justify-between">
//                   <span className="text-sm">Available</span>
//                   <span className="text-sm">
//                     {dashboardData.inventory.available} (
//                     {Math.round((dashboardData.inventory.available / dashboardData.inventory.totalBooks) * 100)}
//                     %)
//                   </span>
//                 </div>
//                 <Progress
//                   value={(dashboardData.inventory.available / dashboardData.inventory.totalBooks) * 100}
//                   className="h-2"
//                 />
//               </div>
//               <div>
//                 <div className="mb-1 flex items-center justify-between">
//                   <span className="text-sm">Checked Out</span>
//                   <span className="text-sm">
//                     {dashboardData.inventory.checkedOut} (
//                     {Math.round(
//                       (dashboardData.inventory.checkedOut / dashboardData.inventory.totalBooks) * 100,
//                     )}
//                     %)
//                   </span>
//                 </div>
//                 <Progress
//                   value={(dashboardData.inventory.checkedOut / dashboardData.inventory.totalBooks) * 100}
//                   className="h-2"
//                 />
//               </div>

//               <div className="pt-2">
//                 <h3 className="mb-2 text-sm font-medium">Popular Categories</h3>
//                 <div className="space-y-2">
//                   {dashboardData.inventory.categories.map((category: any) => (
//                     <div key={category.name} className="space-y-1">
//                       <div className="flex items-center justify-between text-sm">
//                         <span>{category.name}</span>
//                         <span>{category.count}</span>
//                       </div>
//                       <Progress
//                         value={(category.count / dashboardData.inventory.totalBooks) * 100}
//                         className="h-2"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="ghost" size="sm" className="w-full" asChild>
//               <Link href="/dashboard/admin/inventory">
//                 View Inventory
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Upcoming Maintenance */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Upcoming Maintenance</CardTitle>
//             <CardDescription>Scheduled maintenance and tasks</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex flex-col items-center justify-center py-6 text-center">
//                 <p className="text-sm text-muted-foreground">No scheduled maintenance</p>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline" size="sm" className="w-full">
//               Add maintenance Task
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Recent Notifications */}
//         <Card className="col-span-1">
//           <CardHeader>
//             <CardTitle>Recent Notifications</CardTitle>
//             <CardDescription>Latest system notifications</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex flex-col items-center justify-center py-6 text-center">
//                 <p className="text-sm text-muted-foreground">No recent notifications</p>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter>
//             <Button variant="ghost" size="sm" className="w-full" asChild>
//               <Link href="/dashboard/admin/notifications">
//                 View all
//                 <ArrowRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }



import React from 'react'

const page = () => {
  return (
    <div>
      dashbopard admin page
      <p>Admin Dashboard is under construction</p>
    </div>
  )
}

export default page