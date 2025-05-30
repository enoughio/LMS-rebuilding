"use client"

import { useState } from "react"
import { Calendar, Download, LineChart, Loader2, PieChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-provider"

export default function ReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("month")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and analyze library performance</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>

          <div className="mt-4 flex justify-end">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                    +43 from last{" "}
                    {timeRange === "week"
                      ? "week"
                      : timeRange === "month"
                        ? "month"
                        : timeRange === "quarter"
                          ? "quarter"
                          : "year"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">498</div>
                  <p className="text-xs text-muted-foreground">87% of total members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Seat Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    +156 from last{" "}
                    {timeRange === "week"
                      ? "week"
                      : timeRange === "month"
                        ? "month"
                        : timeRange === "quarter"
                          ? "quarter"
                          : "year"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹48,295</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last{" "}
                    {timeRange === "week"
                      ? "week"
                      : timeRange === "month"
                        ? "month"
                        : timeRange === "quarter"
                          ? "quarter"
                          : "year"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Member Growth</CardTitle>
                  <CardDescription>New member registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 80) + 20
                        return (
                          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                            <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                            <span className="mt-2 text-center text-xs text-muted-foreground">
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by source</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <PieChart className="h-40 w-40 text-muted-foreground" />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Memberships (67%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Seat Bookings (27%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Late Fees (4%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Other (2%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Member Demographics</CardTitle>
                  <CardDescription>Age distribution of members</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {[
                        { label: "18-24", value: 65 },
                        { label: "25-34", value: 85 },
                        { label: "35-44", value: 45 },
                        { label: "45-54", value: 30 },
                        { label: "55-64", value: 20 },
                        { label: "65+", value: 15 },
                      ].map((item, i) => (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-primary/20" style={{ height: `${item.value}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Plans</CardTitle>
                  <CardDescription>Distribution by plan type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <PieChart className="h-40 w-40 text-muted-foreground" />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Premium (45%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Basic (35%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Student (15%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Free (5%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Member Retention</CardTitle>
                <CardDescription>Membership renewal rates over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = Math.floor(Math.random() * 30) + 60
                      return (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seat Occupancy</CardTitle>
                  <CardDescription>Daily seat occupancy rate</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 50) + 40
                        return (
                          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                            <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                            <span className="mt-2 text-center text-xs text-muted-foreground">
                              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seat Types</CardTitle>
                  <CardDescription>Bookings by seat type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <PieChart className="h-40 w-40 text-muted-foreground" />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Regular (55%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Quiet Zone (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Computer (20%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
                <CardDescription>Booking distribution by time of day</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const hour = i + 8 // Starting from 8 AM
                      const height =
                        hour >= 10 && hour <= 16
                          ? Math.floor(Math.random() * 30) + 60
                          : Math.floor(Math.random() * 40) + 20
                      return (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">
                            {hour > 12 ? `${hour - 12}PM` : `${hour}AM`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Book Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <PieChart className="h-40 w-40 text-muted-foreground" />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Fiction (35%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Non-Fiction (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Academic (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Technology (15%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                          <span className="text-sm">Self-Help (5%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Book Availability</CardTitle>
                  <CardDescription>Available vs. checked out books</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="relative h-40 w-40 rounded-full border-8 border-primary/20">
                        <div
                          className="absolute inset-0 rounded-full border-8 border-primary"
                          style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 85%)" }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold">85%</p>
                            <p className="text-xs text-muted-foreground">Available</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Available (85%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                          <span className="text-sm">Checked Out (15%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
                <CardDescription>Most checked out books by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {[
                      { label: "Fiction", value: 85 },
                      { label: "Non-Fiction", value: 65 },
                      { label: "Academic", value: 45 },
                      { label: "Technology", value: 75 },
                      { label: "Self-Help", value: 55 },
                    ].map((item, i) => (
                      <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                        <div className="w-full rounded-md bg-primary/20" style={{ height: `${item.value}%` }}></div>
                        <span className="mt-2 text-center text-xs text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trend over the past year</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 60) + 40
                        return (
                          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                            <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                            <span className="mt-2 text-center text-xs text-muted-foreground">
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                  <CardDescription>Breakdown by revenue stream</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <PieChart className="h-40 w-40 text-muted-foreground" />
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-sm">Memberships (67%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm">Seat Bookings (27%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm">Late Fees (4%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-sm">Other (2%)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Membership Plan</CardTitle>
                <CardDescription>Revenue contribution by plan type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {[
                      { label: "Premium", value: 85 },
                      { label: "Basic", value: 45 },
                      { label: "Student", value: 25 },
                    ].map((item, i) => (
                      <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                        <div className="w-full rounded-md bg-primary/20" style={{ height: `${item.value}%` }}></div>
                        <span className="mt-2 text-center text-xs text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
