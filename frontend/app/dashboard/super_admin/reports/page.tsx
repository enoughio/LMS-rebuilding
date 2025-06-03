"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, Printer, FileText, Filter } from "lucide-react"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { reportsApi, type Library, type ReportsFilters } from "@/lib/reports-api"

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [libraryFilter, setLibraryFilter] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("revenue")
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [revenueData, setRevenueData] = useState<any>(null)
  const [userActivityData, setUserActivityData] = useState<any>(null)
  const [libraryPerformanceData, setLibraryPerformanceData] = useState<any>(null)
  const [overviewData, setOverviewData] = useState<any>(null)

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
        // setOverviewData(overview.data)
        // setRevenueData(revenue.data)
        // setUserActivityData(userActivity.data)
        // setLibraryPerformanceData(libraryPerformance.data)
        
//-------------------------------------------------------        
        // Enhance data with random values for testing
        setOverviewData(enhanceWithRandomData(overview.data))
        setRevenueData(enhanceWithRandomData(revenue.data))
        setUserActivityData(enhanceWithRandomData(userActivity.data))
        setLibraryPerformanceData(enhanceWithRandomData(libraryPerformance.data))
//-------------------------------------------------------


      } catch (err) {
        console.error('Failed to fetch reports data:', err)
        setError('Failed to load reports data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [date, libraryFilter])


//-------------------------------------------------------
  // Helper function to generate random numbers
  const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  // Helper function to enhance data with random values where data is zero
  const enhanceWithRandomData = (data: any) => {
    if (!data) {
      // Create default data structure if data is null
      return {
        summary: {
          monthlyRevenue: randomNumber(50000, 200000),
          monthlyBookings: randomNumber(1000, 5000),
          activeUsers: randomNumber(5000, 20000),
          newUsers: randomNumber(500, 2000)
        },
        monthlyRevenue: generateMonthlyRevenueData()
      }
    }
    
    // Create a deep copy to avoid mutating the original data
    const enhancedData = JSON.parse(JSON.stringify(data))
    
    // Add monthlyRevenue array if it doesn't exist or is empty
    if (!enhancedData.monthlyRevenue || enhancedData.monthlyRevenue.length === 0) {
      enhancedData.monthlyRevenue = generateMonthlyRevenueData()
    }
    
    // Replace zero values with random numbers
    const replaceZeros = (obj: any) => {
      if (!obj || typeof obj !== 'object') return
      
      Object.keys(obj).forEach(key => {
        if (obj[key] === 0) {
          // Generate appropriate random value based on field name
          if (key.includes('Revenue') || key.includes('revenue')) {
            obj[key] = randomNumber(10000, 200000)
          } else if (key.includes('Booking') || key.includes('booking')) {
            obj[key] = randomNumber(100, 2000)
          } else if (key.includes('User') || key.includes('user') || key.includes('member')) {
            obj[key] = randomNumber(500, 5000)
          } else {
            // Default random value for other fields
            obj[key] = randomNumber(50, 1000)
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          replaceZeros(obj[key])
        }
      })
    }
    
    replaceZeros(enhancedData)
    return enhancedData
  }

  // Helper function to generate monthly revenue data
  const generateMonthlyRevenueData = () => {
    // Generate monthly data for the last 12 months
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, i) => {
      // Create slightly variable revenue with occasional peaks and valleys for realism
      const baseRevenue = randomNumber(60000, 90000);
      const variability = Math.sin(i * 0.8) * 20000; // Create some waves in the data
      
      return {
        month,
        revenue: Math.max(10000, Math.round(baseRevenue + variability))
      }
    });
  }
//-------------------------------------------------------


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and generate platform reports</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {/* <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue Report</SelectItem>
              <SelectItem value="users">User Activity</SelectItem>
              <SelectItem value="libraries">Library Performance</SelectItem>
              <SelectItem value="bookings">Booking Analytics</SelectItem>
            </SelectContent>
          </Select> */}

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

          {/* <DatePickerWithRange date={date} setDate={setDate} /> */}
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
                    <CardDescription>Member and library growth over time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px] relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-muted-foreground">
                        <div>100k</div>
                        <div>50k</div>
                        <div>20k</div>
                        <div>10k</div>
                        <div>0</div>
                      </div>
                      
                      {/* Chart area with grid lines */}
                      <div className="ml-12 h-full border-b border-l relative">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-t border-muted/30 w-full"></div>
                          ))}
                        </div>
                        
                        {/* Vertical grid lines and X-axis labels */}
                        <div className="absolute inset-0 flex w-full h-full">
                          {[...Array(12)].map((_, i) => {
                            return (
                              <div key={i} className="flex-1 border-r border-muted/30 flex flex-col justify-between">
                                <div className="h-full"></div>
                                <div className="text-xs text-muted-foreground text-center mt-2">
                                  {overviewData.monthlyRevenue && i < overviewData.monthlyRevenue.length
                                    ? overviewData.monthlyRevenue[i].month
                                    : ''
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Revenue line chart */}
                        {overviewData?.monthlyRevenue && (
                          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgb(220, 130, 30)" stopOpacity="0.2"/>
                                <stop offset="100%" stopColor="rgb(220, 130, 30)" stopOpacity="0.05"/>
                              </linearGradient>
                            </defs>
                            
                            {/* Draw the line */}
                            <path
                              d={`M ${overviewData.monthlyRevenue.map((d: any, i: number) => {
                                const x = (i / (overviewData.monthlyRevenue.length - 1)) * 100;
                                const maxRevenue = Math.max(...overviewData.monthlyRevenue.map((d: any) => d.revenue));
                                const y = 100 - (d.revenue / maxRevenue * 80 + 10);
                                return `${x} ${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="rgb(220, 130, 30)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="4,2"
                            />
                            
                            {/* Area under the line */}
                            <path
                              d={`M ${overviewData.monthlyRevenue.map((d: any, i: number) => {
                                const x = (i / (overviewData.monthlyRevenue.length - 1)) * 100;
                                const maxRevenue = Math.max(...overviewData.monthlyRevenue.map((d: any) => d.revenue));
                                const y = 100 - (d.revenue / maxRevenue * 80 + 10);
                                return `${x} ${y}`;
                              }).join(' L ')} L 100 100 L 0 100 Z`}
                              fill="url(#revenue-gradient)"
                            />
                            
                            {/* Add dots at each data point */}
                            {overviewData.monthlyRevenue.map((d: any, i: number) => {
                              const x = (i / (overviewData.monthlyRevenue.length - 1)) * 100;
                              const maxRevenue = Math.max(...overviewData.monthlyRevenue.map((d: any) => d.revenue));
                              const y = 100 - (d.revenue / maxRevenue * 80 + 10);
                              return (
                                <circle 
                                  key={i} 
                                  cx={x} 
                                  cy={y} 
                                  r="2" 
                                  fill="rgb(220, 130, 30)" 
                                  stroke="white" 
                                  strokeWidth="1"
                                />
                              );
                            })}
                          </svg>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly user growth for the past year</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[300px] relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-muted-foreground">
                        <div>100</div>
                        <div>80</div>
                        <div>60</div>
                        <div>40</div>
                        <div>20</div>
                      </div>
                      
                      {/* Chart area with grid lines */}
                      <div className="ml-12 h-full border-b border-l relative">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-0 grid grid-rows-4 w-full h-full">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-t border-muted/30 w-full"></div>
                          ))}
                        </div>
                        
                        {/* Vertical grid lines and X-axis labels */}
                        <div className="absolute inset-0 flex w-full h-full">
                          {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((month, i) => (
                            <div key={i} className="flex-1 border-r border-muted/30 flex flex-col justify-between">
                              <div className="h-full"></div>
                              <div className="text-xs text-muted-foreground text-center mt-2">
                                {month}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* User growth lines */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Dynamic user activity line using actual data */}
                          {userActivityData?.dailyActivity && (
                            <path
                              d={`M ${userActivityData.dailyActivity.slice(-6).map((activity: any, i: number) => {
                                const x = (i / (userActivityData.dailyActivity.slice(-6).length - 1)) * 100;
                                const maxUsers = Math.max(...userActivityData.dailyActivity.slice(-6).map((d: any) => d.activeUsers));
                                const y = 100 - (activity.activeUsers / maxUsers * 80 + 10);
                                return `${x} ${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="#8B4513"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                          
                          {/* New users line */}
                          {userActivityData?.dailyActivity && (
                            <path
                              d={`M ${userActivityData.dailyActivity.slice(-6).map((activity: any, i: number) => {
                                const x = (i / (userActivityData.dailyActivity.slice(-6).length - 1)) * 100;
                                const maxUsers = Math.max(...userActivityData.dailyActivity.slice(-6).map((d: any) => d.newUsers));
                                const y = 100 - (activity.newUsers / maxUsers * 80 + 10);
                                return `${x} ${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="#A0865E"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                          
                          {/* Bookings line */}
                          {userActivityData?.dailyActivity && (
                            <path
                              d={`M ${userActivityData.dailyActivity.slice(-6).map((activity: any, i: number) => {
                                const x = (i / (userActivityData.dailyActivity.slice(-6).length - 1)) * 100;
                                const maxBookings = Math.max(...userActivityData.dailyActivity.slice(-6).map((d: any) => d.bookings));
                                const y = 100 - (activity.bookings / maxBookings * 80 + 10);
                                return `${x} ${y}`;
                              }).join(' L ')}`}
                              fill="none"
                              stroke="#654321"
                              strokeWidth="0.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Libraries</CardTitle>
                    <CardDescription>Libraries with highest ratings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {overviewData.topLibraries?.map((library: any, i: number) => (
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
                      {revenueData.monthlyRevenue?.map((data: any, i: number) => {
                        const height = (data.revenue / Math.max(...revenueData.monthlyRevenue.map((d: any) => d.revenue))) * 100
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
                    {userActivityData.dailyActivity?.slice(-7).map((activity: any, i: number) => (
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
                  {libraryPerformanceData.libraryPerformance?.map((library: any, i: number) => (
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
