"use client"

import { useState, useEffect } from "react"
import { Calendar, Loader2, Search, X, UserPlus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/context/AuthContext" 
import type { SeatBooking, BookingStatus } from "@/types/library"
import { useToast } from "@/components/ui/use-toast"

export default function SeatBookingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<SeatBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<SeatBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        if (user?.libraryId) {
          const response = await fetch(`/api/libraries/${user.libraryId}/bookings`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch bookings')
          }
          
          const data = await response.json()
          setBookings(data)
          setFilteredBookings(data)
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch bookings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  useEffect(() => {
    // Apply filters
    let filtered = [...bookings]

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.seatName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter.toUpperCase() as BookingStatus)
    }

    if (dateFilter) {
      filtered = filtered.filter((booking) => booking.date === dateFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter, dateFilter])

  // Group bookings by date
  const bookingsByDate = filteredBookings.reduce(
    (acc, booking) => {
      if (!acc[booking.date]) {
        acc[booking.date] = []
      }
      acc[booking.date].push(booking)
      return acc
    },
    {} as Record<string, SeatBooking[]>,
  )

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(bookingsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }

      toast({
        title: "Booking Cancelled",
        description: `Booking ${bookingId.slice(0, 8)} has been cancelled.`,
      })

      // Refresh bookings data
      if (user?.libraryId) {
        const bookingsResponse = await fetch(`/api/libraries/${user.libraryId}/bookings`)
        if (bookingsResponse.ok) {
          const updatedBookings = await bookingsResponse.json()
          setBookings(updatedBookings)
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      })
    }
  }

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'complete' }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete booking')
      }

      await response.json()

      toast({
        title: "Booking Completed",
        description: `Booking ${bookingId.slice(0, 8)} has been marked as completed.`,
      })

      // Refresh bookings data
      if (user?.libraryId) {
        const bookingsResponse = await fetch(`/api/libraries/${user.libraryId}/bookings`)
        if (bookingsResponse.ok) {
          const updatedBookings = await bookingsResponse.json()
          setBookings(updatedBookings)
        }
      }
    } catch (error) {
      console.error("Error completing booking:", error)
      toast({
        title: "Error",
        description: "Failed to complete booking",
        variant: "destructive",
      })
    }
  }

  // Get today's bookings for the "Today's Bookings" tab
  const today = new Date().toISOString().split("T")[0]
  const todaysBookings = bookings.filter((booking) => booking.date === today)

  // Get upcoming bookings for the "Upcoming" tab
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED" && new Date(booking.date) > new Date(),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seat Booking Management</h1>
          <p className="text-muted-foreground">Manage seat bookings and reservations</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/admin/seat-booking/manual-booking">
              <UserPlus className="mr-2 h-4 w-4" />
              Manual Booking
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/admin/seat-booking/guest`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Walk-in Booking
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or seat..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="w-20 text-sm">
                Status:
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="date-filter" className="w-20 text-sm">
                Date:
              </Label>
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-[180px]"
              />
              {dateFilter && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDateFilter("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="bookings" className="mt-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="space-y-4">
                <h2 className="text-lg font-semibold">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bookingsByDate[date].map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{booking.userName || 'Guest'}</CardTitle>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED"
                                ? "default"
                                : booking.status === "COMPLETED"
                                  ? "secondary"
                                  : booking.status === "CANCELLED"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <CardDescription>Booking ID: {booking.id.slice(0, 8)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Seat:</span>
                            <span className="text-sm font-medium">{booking.seatName || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Time:</span>
                            <span className="text-sm font-medium">
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Booked on:</span>
                            <span className="text-sm font-medium">
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      {booking.status === "CONFIRMED" && (
                        <div className="flex border-t p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 flex-1"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-gray-500 text-white"
                            onClick={() => handleCompleteBooking(booking.id)}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="today" className="mt-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : todaysBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No bookings for today</h3>
              <p className="text-muted-foreground">There are no bookings scheduled for today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todaysBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{booking.userName || 'Guest'}</CardTitle>
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : booking.status === "COMPLETED"
                              ? "secondary"
                              : booking.status === "CANCELLED"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <CardDescription>Booking ID: {booking.id.slice(0, 8)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Seat:</span>
                        <span className="text-sm font-medium">{booking.seatName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <span className="text-sm font-medium">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Booked on:</span>
                        <span className="text-sm font-medium">
                          {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  {booking.status === "CONFIRMED" && (
                    <div className="flex border-t p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 flex-1"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
              <p className="text-muted-foreground">There are no upcoming bookings scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{booking.userName || 'Guest'}</CardTitle>
                      <Badge variant="default">{booking.status}</Badge>
                    </div>
                    <CardDescription>Booking ID: {booking.id.slice(0, 8)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Seat:</span>
                        <span className="text-sm font-medium">{booking.seatName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <span className="text-sm font-medium">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex border-t p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
