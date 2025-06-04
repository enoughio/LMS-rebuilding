"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, Printer } from "lucide-react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { reportsApi, type Library, type ReportsFilters, type RevenueReportsResponse, type UserActivityReportsResponse, type LibraryPerformanceReportsResponse, type ReportsOverviewResponse, type RevenueData, type UserActivityData, type LibraryPerformanceData, type TopLibrary } from "@/lib/reports-api"

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [libraryFilter, setLibraryFilter] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("revenue")
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)  // Data states
  const [revenueData, setRevenueData] = useState<RevenueReportsResponse | null>(null)
  const [userActivityData, setUserActivityData] = useState<UserActivityReportsResponse | null>(null)
  const [libraryPerformanceData, setLibraryPerformanceData] = useState<LibraryPerformanceReportsResponse | null>(null)
  const [overviewData, setOverviewData] = useState<ReportsOverviewResponse | null>(null)

  // Fetch libraries for dropdown
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await reportsApi.getLibrariesList()
        if (response.success) {
          setLibraries(response.data.libraries)
        }
      } catch (err) {
        console.error('Failed to fetch libraries:', err)
        setError('Failed to load libraries')
      }
    }
    fetchLibraries()
  }, [])

  // Fetch data based on filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const filters: ReportsFilters = {
          startDate: date.from?.toISOString(),
          endDate: date.to?.toISOString(),
          libraryId: libraryFilter !== "all" ? libraryFilter : undefined
        }

        const [overview, revenue, userActivity, libraryPerformance] = await Promise.all([
          reportsApi.getReportsOverview({ libraryId: filters.libraryId }),
          reportsApi.getRevenueReports(filters),
          reportsApi.getUserActivityReports(filters),
          reportsApi.getLibraryPerformanceReports(filters)
        ])

        setOverviewData(overview.data)
        setRevenueData(revenue.data)
        setUserActivityData(userActivity.data)
        setLibraryPerformanceData(libraryPerformance.data)
      } catch (err) {
        console.error('Failed to fetch reports data:', err)
        setError('Failed to load reports data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [date, libraryFilter])

  if (loading) {
    return (
      <div className="space-y-6 min-w-[70vw]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 min-w-[70vw]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 min-w-[70vw]">
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
              {libraries.map((library) => (
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
          {overviewData && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{overviewData.summary.monthlyRevenue?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewData.summary.monthlyBookings?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewData.summary.activeUsers?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>New Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewData.summary.newUsers?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <div className="flex h-full w-full items-end justify-between gap-2">                        {revenueData?.monthlyRevenue?.map((data: RevenueData, i: number) => {
                          const height = (data.revenue / Math.max(...revenueData.monthlyRevenue.map((d: RevenueData) => d.revenue))) * 100
                          return (
                            <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                              <div 
                                className="w-full rounded-md bg-primary" 
                                style={{ height: `${height}%` }}
                                title={`${data.month}: ₹${data.revenue}`}
                              ></div>
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
                    <CardTitle>Top Performing Libraries</CardTitle>
                    <CardDescription>Libraries with highest ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {overviewData.topLibraries?.map((library: TopLibrary, i: number) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                          <div>
                            <h3 className="font-medium">{library.name}</h3>
                            <p className="text-sm text-muted-foreground">{library.members} members • {library.city}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{library.rating}/5 ⭐</p>
                            <p className="text-sm text-muted-foreground">{library.bookings} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="mt-4 space-y-6">
          {revenueData && (
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Membership Fees:</span>
                      <span className="font-medium">₹{revenueData.revenueBreakdown.membership?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seat Bookings:</span>
                      <span className="font-medium">₹{revenueData.revenueBreakdown.seatBooking?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penalties:</span>
                      <span className="font-medium">₹{revenueData.revenueBreakdown.penalty?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>E-Book Purchases:</span>
                      <span className="font-medium">₹{revenueData.revenueBreakdown.eBookPurchase?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span className="font-medium">₹{revenueData.revenueBreakdown.other?.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold">
                      <span>Total Revenue:</span>
                      <span>₹{revenueData.totalRevenue?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {revenueData.monthlyRevenue?.map((data: RevenueData, i: number) => {
                        const height = (data.revenue / Math.max(...revenueData.monthlyRevenue.map((d: RevenueData) => d.revenue))) * 100
                        return (
                          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                            <div 
                              className="w-full rounded-md bg-green-500" 
                              style={{ height: `${height}%` }}
                              title={`${data.month}: ₹${data.revenue}`}
                            ></div>
                            <span className="mt-2 text-center text-xs text-muted-foreground">{data.month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-4 space-y-6">
          {userActivityData && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userActivityData.summary.totalUsers?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Active Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userActivityData.summary.totalActiveToday?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>New This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userActivityData.summary.totalNewThisMonth?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daily User Activity</CardTitle>
                  <CardDescription>User activity for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivityData.dailyActivity?.slice(-7).map((activity: UserActivityData, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                        <div>
                          <h3 className="font-medium">{new Date(activity.date).toLocaleDateString()}</h3>
                          <p className="text-sm text-muted-foreground">{activity.newUsers} new users</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{activity.activeUsers} active</p>
                          <p className="text-sm text-muted-foreground">{activity.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="libraries" className="mt-4 space-y-6">
          {libraryPerformanceData && (
            <Card>
              <CardHeader>
                <CardTitle>Library Performance</CardTitle>
                <CardDescription>Performance metrics for all libraries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {libraryPerformanceData.libraryPerformance?.map((library: LibraryPerformanceData, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                      <div>
                        <h3 className="font-medium">{library.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {library.city}, {library.state} • {library.members} members
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{library.revenue?.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {library.bookings} bookings • {library.occupancyRate}% occupancy
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
