"use client"

import { useState } from "react"
import { Download, FileText, Filter, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

// Mock data for reports
const mockRevenueData = [
  { month: "Jan", revenue: 32450, users: 1245 },
  { month: "Feb", revenue: 28700, users: 1320 },
  { month: "Mar", revenue: 34200, users: 1410 },
  { month: "Apr", revenue: 39800, users: 1560 },
  { month: "May", revenue: 42300, users: 1680 },
  { month: "Jun", revenue: 45100, users: 1790 },
  { month: "Jul", revenue: 48200, users: 1920 },
  { month: "Aug", revenue: 51300, users: 2050 },
  { month: "Sep", revenue: 49700, users: 2180 },
  { month: "Oct", revenue: 52400, users: 2310 },
  { month: "Nov", revenue: 54800, users: 2450 },
  { month: "Dec", revenue: 58200, users: 2600 },
]

const mockLibraryPerformance = [
  { name: "Central Library", revenue: 12450, members: 450, bookings: 1245 },
  { name: "Riverside Reading Hub", revenue: 9800, members: 320, bookings: 980 },
  { name: "Tech Knowledge Center", revenue: 15200, members: 520, bookings: 1520 },
  { name: "North Hills Book Club", revenue: 7600, members: 210, bookings: 760 },
  { name: "Eastside Reading Center", revenue: 8900, members: 280, bookings: 890 },
]

const mockUserActivity = [
  { date: "2023-10-01", newUsers: 45, activeUsers: 1250, bookings: 320 },
  { date: "2023-10-02", newUsers: 38, activeUsers: 1280, bookings: 305 },
  { date: "2023-10-03", newUsers: 42, activeUsers: 1310, bookings: 330 },
  { date: "2023-10-04", newUsers: 50, activeUsers: 1340, bookings: 345 },
  { date: "2023-10-05", newUsers: 55, activeUsers: 1380, bookings: 360 },
  { date: "2023-10-06", newUsers: 48, activeUsers: 1410, bookings: 350 },
  { date: "2023-10-07", newUsers: 40, activeUsers: 1430, bookings: 325 },
]

export default function ReportsPage() {
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [libraryFilter, setLibraryFilter] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("revenue")

  // Mock libraries for dropdown
  const mockLibraries = [
    { id: "all", name: "All Libraries" },
    { id: "lib-1", name: "Central Library" },
    { id: "lib-2", name: "Riverside Reading Hub" },
    { id: "lib-3", name: "Tech Knowledge Center" },
    { id: "lib-4", name: "North Hills Book Club" },
    { id: "lib-5", name: "Eastside Reading Center" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and generate platform reports</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Report</SelectItem>
              <SelectItem value="users">User Activity</SelectItem>
              <SelectItem value="libraries">Library Performance</SelectItem>
              <SelectItem value="bookings">Booking Analytics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={libraryFilter} onValueChange={setLibraryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by library" />
            </SelectTrigger>
            <SelectContent>
              {mockLibraries.map((library) => (
                <SelectItem key={library.id} value={library.id}>
                  {library.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="libraries">Libraries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a chart in a real implementation */}
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {mockRevenueData.map((data, i) => {
                      const height = (data.revenue / 60000) * 100
                      return (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-primary" style={{ height: `${height}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">{data.month}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user growth for the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* This would be a chart in a real implementation */}
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {mockRevenueData.map((data, i) => {
                      const height = (data.users / 3000) * 100
                      return (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-blue-500" style={{ height: `${height}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">{data.month}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Libraries</CardTitle>
                <CardDescription>Libraries with highest revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLibraryPerformance.map((library, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                      <div>
                        <h3 className="font-medium">{library.name}</h3>
                        <p className="text-sm text-muted-foreground">{library.members} members</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{library.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{library.bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Daily user activity for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserActivity.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                      <div>
                        <h3 className="font-medium">{new Date(activity.date).toLocaleDateString()}</h3>
                        <p className="text-sm text-muted-foreground">{activity.newUsers} new users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.activeUsers} active users</p>
                        <p className="text-sm text-muted-foreground">{activity.bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Revenue Report</CardTitle>
                <CardDescription>Detailed revenue breakdown</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                  <div className="col-span-3">Period</div>
                  <div className="col-span-3">Membership Revenue</div>
                  <div className="col-span-2">Booking Revenue</div>
                  <div className="col-span-2">Other Revenue</div>
                  <div className="col-span-2">Total</div>
                </div>
                {mockRevenueData.map((data, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                    <div className="col-span-3">
                      <p className="font-medium">{data.month} 2023</p>
                    </div>
                    <div className="col-span-3">
                      <p>₹{Math.round(data.revenue * 0.7).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p>₹{Math.round(data.revenue * 0.2).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p>₹{Math.round(data.revenue * 0.1).toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">₹{data.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-12 gap-4 border-t bg-muted/50 p-4 font-medium">
                  <div className="col-span-3">Total</div>
                  <div className="col-span-3">
                    ₹{mockRevenueData.reduce((sum, data) => sum + Math.round(data.revenue * 0.7), 0).toLocaleString()}
                  </div>
                  <div className="col-span-2">
                    ₹{mockRevenueData.reduce((sum, data) => sum + Math.round(data.revenue * 0.2), 0).toLocaleString()}
                  </div>
                  <div className="col-span-2">
                    ₹{mockRevenueData.reduce((sum, data) => sum + Math.round(data.revenue * 0.1), 0).toLocaleString()}
                  </div>
                  <div className="col-span-2">
                    ₹{mockRevenueData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Full Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Activity Report</CardTitle>
                <CardDescription>Detailed user activity breakdown</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                  <div className="col-span-3">Period</div>
                  <div className="col-span-2">New Users</div>
                  <div className="col-span-2">Active Users</div>
                  <div className="col-span-2">Inactive Users</div>
                  <div className="col-span-3">Retention Rate</div>
                </div>
                {mockRevenueData.map((data, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                    <div className="col-span-3">
                      <p className="font-medium">{data.month} 2023</p>
                    </div>
                    <div className="col-span-2">
                      <p>{Math.round(data.users * 0.1)}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{Math.round(data.users * 0.8)}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{Math.round(data.users * 0.2)}</p>
                    </div>
                    <div className="col-span-3">
                      <p>{Math.round(70 + Math.random() * 20)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Full Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="libraries" className="mt-4 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Library Performance Report</CardTitle>
                <CardDescription>Detailed library performance breakdown</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                  <div className="col-span-3">Library</div>
                  <div className="col-span-2">Members</div>
                  <div className="col-span-2">Revenue</div>
                  <div className="col-span-2">Bookings</div>
                  <div className="col-span-3">Occupancy Rate</div>
                </div>
                {mockLibraryPerformance.map((library, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                    <div className="col-span-3">
                      <p className="font-medium">{library.name}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{library.members}</p>
                    </div>
                    <div className="col-span-2">
                      <p>₹{library.revenue.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p>{library.bookings}</p>
                    </div>
                    <div className="col-span-3">
                      <p>{Math.round(60 + Math.random() * 30)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Full Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
