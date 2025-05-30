"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Clock, DollarSign, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-provider"
import { mockLibraryService } from "@/lib/mock-api/library-service"

// Mock data for admin dashboard
const mockDashboardData = {
  todaysBookings: {
    count: 23,
    change: 5,
    comparedTo: "yesterday",
  },
  activeMembers: {
    count: 573,
    change: 43,
    comparedTo: "this week",
  },
  todaysRevenue: {
    amount: 12432,
    change: 2523,
    comparedTo: "yesterday",
  },
  booksCheckedOut: {
    count: 47,
    change: 2523,
    comparedTo: "yesterday",
  },
  occupancyRate: {
    current: 18,
    total: 30,
    sessions: [
      { id: 1, name: "Morning session", time: "08:00 AM - 12:00 PM", booked: 24, total: 30 },
      { id: 2, name: "Afternoon session", time: "01:00 PM - 05:00 PM", booked: 18, total: 30 },
      { id: 3, name: "Evening session", time: "06:00 PM - 09:00 PM", booked: 12, total: 30 },
    ],
  },
  inventory: {
    totalBooks: 2457,
    available: 2100,
    checkedOut: 357,
    categories: [
      { name: "Fiction", count: 850 },
      { name: "Science & Technology", count: 620 },
      { name: "Business & Economics", count: 480 },
      { name: "Self Help & Psychology", count: 320 },
      { name: "Other", count: 187 },
    ],
  },
  maintenance: [
    {
      id: 1,
      title: "WiFi System Upgrade",
      date: "May 1, 2025",
      time: "8AM - 12PM",
      description: "Library will be open but wifi unavailable",
    },
    {
      id: 2,
      title: "WiFi System Upgrade",
      date: "May 1, 2025",
      time: "8AM - 12PM",
      description: "Library will be open but wifi unavailable",
    },
    {
      id: 3,
      title: "WiFi System Upgrade",
      date: "May 1, 2025",
      time: "8AM - 12PM",
      description: "Library will be open but wifi unavailable",
    },
  ],
  notifications: [
    {
      id: 1,
      title: "Overdue Books Alert",
      description: "8 books are overdue today and reminders to members.",
      time: "15 min ago",
    },
    {
      id: 2,
      title: "New Member Registration",
      description: "5 new members registered, review and approve application.",
      time: "2 hours ago",
    },
    {
      id: 3,
      title: "System Upgrade",
      description: "Platform update scheduled for tonight at 2AM. No downtime expected.",
      time: "5 hours ago",
    },
  ],
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (user?.libraryId) {
          const bookings = await mockLibraryService.getLibraryBookings(user.libraryId)

          // Sort by date (newest first) and take the most recent 5
          const recentBookings = [...bookings]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((booking) => ({
              type: "booking",
              userName: booking.userName,
              time: new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              seatName: booking.seatName,
              id: booking.id,
            }))

          setRecentActivity(recentBookings)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="space-y-6  max-w-[1920px] lg:overflow-x-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin's Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your library.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.todaysBookings.count}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardData.todaysBookings.change > 0 ? "+" : ""}
              {mockDashboardData.todaysBookings.change} Compared to {mockDashboardData.todaysBookings.comparedTo}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.activeMembers.count}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardData.activeMembers.change > 0 ? "+" : ""}
              {mockDashboardData.activeMembers.change} Compared to {mockDashboardData.activeMembers.comparedTo}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockDashboardData.todaysRevenue.amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardData.todaysRevenue.change > 0 ? "+" : ""}
              {mockDashboardData.todaysRevenue.change} Compared to {mockDashboardData.todaysRevenue.comparedTo}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Books checked out</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.booksCheckedOut.count}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardData.booksCheckedOut.change > 0 ? "+" : ""}
              {mockDashboardData.booksCheckedOut.change} Compared to {mockDashboardData.booksCheckedOut.comparedTo}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Occupancy Rate */}
        <Card className="col-span-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Seat occupancy over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              {/* This would be a chart in a real implementation */}
              <div className="flex h-full w-full items-end justify-between gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20
                  return (
                    <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                      <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                      <span className="mt-2 text-center text-xs text-muted-foreground">{2016 + i}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today's schedule</CardTitle>
            <CardDescription>Upcoming bookings for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Occupancy</span>
                <span className="text-sm">
                  {mockDashboardData.occupancyRate.current}/{mockDashboardData.occupancyRate.total} seats
                </span>
              </div>

              <div className="space-y-4">
                {mockDashboardData.occupancyRate.sessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-4">
                    <div className="flex w-8 flex-col items-center">
                      {session.id === 1 && <Clock className="h-5 w-5 text-yellow-500" />}
                      {session.id === 2 && <Clock className="h-5 w-5 text-blue-500" />}
                      {session.id === 3 && <Clock className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{session.name}</p>
                      <p className="text-xs text-muted-foreground">{session.time}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {session.booked}/{session.total} booked
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/admin/seat-booking">
                Manage Bookings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Member Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Member Activity</CardTitle>
            <CardDescription>Latest check in and book checkouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-1/4 animate-pulse rounded bg-muted"></div>
                      </div>
                      <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                      <Image src="/placeholder.svg?height=40&width=40" alt={activity.userName} width={40} height={40} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.userName}</p>
                      <p className="text-xs text-muted-foreground">Checked in at {activity.time}</p>
                    </div>
                    <Badge variant="outline">Seat #{activity.seatName}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/admin/seat-booking">
                View All Activity
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Inventory Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Book inventory overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Total books</span>
                  <span className="text-sm font-medium">{mockDashboardData.inventory.totalBooks}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm">Available</span>
                  <span className="text-sm">
                    {mockDashboardData.inventory.available} (
                    {Math.round((mockDashboardData.inventory.available / mockDashboardData.inventory.totalBooks) * 100)}
                    %)
                  </span>
                </div>
                <Progress
                  value={(mockDashboardData.inventory.available / mockDashboardData.inventory.totalBooks) * 100}
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm">Checked Out</span>
                  <span className="text-sm">
                    {mockDashboardData.inventory.checkedOut} (
                    {Math.round(
                      (mockDashboardData.inventory.checkedOut / mockDashboardData.inventory.totalBooks) * 100,
                    )}
                    %)
                  </span>
                </div>
                <Progress
                  value={(mockDashboardData.inventory.checkedOut / mockDashboardData.inventory.totalBooks) * 100}
                  className="h-2"
                />
              </div>

              <div className="pt-2">
                <h3 className="mb-2 text-sm font-medium">Popular Categories</h3>
                <div className="space-y-2">
                  {mockDashboardData.inventory.categories.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{category.name}</span>
                        <span>{category.count}</span>
                      </div>
                      <Progress
                        value={(category.count / mockDashboardData.inventory.totalBooks) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/admin/inventory">
                View Inventory
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Upcoming Maintenance */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Scheduled maintenance and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.maintenance.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {item.date} (Sunday) - Library will be open but {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Add maintenance Task
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Notifications */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.notifications.map((notification) => (
                <div key={notification.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/admin/notifications">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
