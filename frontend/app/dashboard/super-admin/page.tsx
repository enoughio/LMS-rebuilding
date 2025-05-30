"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Building2, Check, CreditCard, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-provider"

// Mock data for super admin dashboard
const mockDashboardData = {
  platformStats: {
    totalLibraries: {
      count: 42,
      change: 3,
      period: "this month",
    },
    totalMembers: {
      count: 24853,
      change: 287,
      period: "this month",
    },
    monthlyRevenue: {
      amount: 48295,
      change: 12.5,
      period: "last month",
    },
    platformHealth: {
      percentage: 99.8,
      uptime: "this month",
    },
  },
  revenueBreakdown: {
    membershipFees: {
      amount: 32450,
      percentage: 67,
    },
    seatBookings: {
      amount: 12845,
      percentage: 27,
    },
    otherServices: {
      amount: 3000,
      percentage: 6,
    },
    platformCommission: {
      amount: 9659,
      percentage: 20,
    },
  },
  topLibraries: [
    {
      id: "lib-1",
      name: "Central City Library",
      location: "Downtown, Central City",
      revenue: 5240,
    },
    {
      id: "lib-2",
      name: "Riverside Reading Hub",
      location: "Riverside, Central City",
      revenue: 4120,
    },
    {
      id: "lib-3",
      name: "Knowledge Corner",
      location: "University Area, Central City",
      revenue: 3980,
    },
    {
      id: "lib-4",
      name: "Tech Library Hub",
      location: "Innovation District, Central City",
      revenue: 3750,
    },
  ],
  systemStatus: {
    allOperational: true,
    lastChecked: "5 min ago",
    resources: {
      cpu: 32,
      memory: 65,
      storage: 48,
    },
    maintenance: {
      scheduled: true,
      date: "May 2, 2025",
      status: "Resolved",
    },
  },
  pendingApprovals: [
    {
      id: "app-1",
      name: "Westside Community Library",
      location: "Westside, Central City",
    },
    {
      id: "app-2",
      name: "Eastside Reading Center",
      location: "Eastside, Central City",
    },
    {
      id: "app-3",
      name: "North Hills Book Club",
      location: "North Hills, Central City",
    },
  ],
  recentActivities: [
    {
      id: "act-1",
      type: "system_update",
      title: "System Update Deployed",
      description: "Version 2.5.0 deployed with new features",
      time: "2 hours ago",
    },
    {
      id: "act-2",
      type: "library_approved",
      title: "New Library Approved",
      description: "Sunshine Reading Lounge has been approved",
      time: "5 hours ago",
    },
  ],
}

export default function SuperAdminDashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  return (
    <div className="space-y-6  max-w-[1920px] lg:overflow-x-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the super admin dashboard. Here's an overview of the platform.
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Libraries</CardTitle>
            <Building2 className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.platformStats.totalLibraries.count}</div>
            <p className="text-xs text-gray-400">
              +{mockDashboardData.platformStats.totalLibraries.change}{" "}
              {mockDashboardData.platformStats.totalLibraries.period}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardData.platformStats.totalMembers.count.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              +{mockDashboardData.platformStats.totalMembers.change}{" "}
              {mockDashboardData.platformStats.totalMembers.period}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{mockDashboardData.platformStats.monthlyRevenue.amount.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              +{mockDashboardData.platformStats.monthlyRevenue.change}% from{" "}
              {mockDashboardData.platformStats.monthlyRevenue.period}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Settings className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardData.platformStats.platformHealth.percentage}%</div>
            <p className="text-xs text-gray-400">Uptime {mockDashboardData.platformStats.platformHealth.uptime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Platform Growth */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Member and library growth over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
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

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Revenue sources for the current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Membership Fees</span>
                  <span className="text-sm">
                    ₹{mockDashboardData.revenueBreakdown.membershipFees.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={mockDashboardData.revenueBreakdown.membershipFees.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {mockDashboardData.revenueBreakdown.membershipFees.percentage}% of total revenue
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Seat Bookings</span>
                  <span className="text-sm">
                    ₹{mockDashboardData.revenueBreakdown.seatBookings.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={mockDashboardData.revenueBreakdown.seatBookings.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {mockDashboardData.revenueBreakdown.seatBookings.percentage}% of total revenue
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Other Services</span>
                  <span className="text-sm">
                    ₹{mockDashboardData.revenueBreakdown.otherServices.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={mockDashboardData.revenueBreakdown.otherServices.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {mockDashboardData.revenueBreakdown.otherServices.percentage}% of total revenue
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Platform Commission</span>
                  <span className="text-sm">
                    ₹{mockDashboardData.revenueBreakdown.platformCommission.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={mockDashboardData.revenueBreakdown.platformCommission.percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground">
                    {mockDashboardData.revenueBreakdown.platformCommission.percentage}% of total revenue
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Library Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Library Performance</CardTitle>
            <CardDescription>Performing libraries this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.topLibraries.map((library) => (
                <div key={library.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <h3 className="font-medium">{library.name}</h3>
                    <p className="text-sm text-muted-foreground">{library.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{library.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/super-admin/libraries">
                View all libraries
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-600 dark:text-green-400">All Systems Operational</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Last checked {mockDashboardData.systemStatus.lastChecked}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Server Resources</h3>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>{mockDashboardData.systemStatus.resources.cpu}%</span>
                  </div>
                  <Progress value={mockDashboardData.systemStatus.resources.cpu} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{mockDashboardData.systemStatus.resources.memory}%</span>
                  </div>
                  <Progress value={mockDashboardData.systemStatus.resources.memory} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>{mockDashboardData.systemStatus.resources.storage}%</span>
                  </div>
                  <Progress value={mockDashboardData.systemStatus.resources.storage} className="h-2" />
                </div>
              </div>

              <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
                <h3 className="font-medium text-green-600 dark:text-green-400">Database Maintenance</h3>
                <p className="text-sm text-green-600/80 dark:text-green-400/80">
                  Scheduled maintenance completed on {mockDashboardData.systemStatus.maintenance.date}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                >
                  {mockDashboardData.systemStatus.maintenance.status}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              View system setting
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Libraries and admins awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{approval.name}</h3>
                    <p className="text-sm text-muted-foreground">{approval.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
