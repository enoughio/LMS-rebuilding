"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Filter, Loader2, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library, SeatBooking } from "@/types/library"
import { useAuth } from "@/lib/auth-provider"

export default function BookSeatPage() {
  const { user } = useAuth()
  const [libraries, setLibraries] = useState<Library[]>([])
  const [bookings, setBookings] = useState<SeatBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [librariesData, bookingsData] = await Promise.all([
          mockLibraryService.getLibraries(),
          user ? mockLibraryService.getUserBookings(user.id) : Promise.resolve([]),
        ])
        setLibraries(librariesData)
        setBookings(bookingsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const filteredLibraries = libraries.filter(
    (library) =>
      library.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      library.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter bookings
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.date) >= new Date(),
  )
  const pastBookings = bookings.filter(
    (booking) => booking.status === "completed" || new Date(booking.date) < new Date(),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Book a Seat</h1>
        <p className="text-muted-foreground">Find and book seats at your favorite libraries</p>
      </div>

      <Tabs defaultValue="libraries">
        <TabsList>
          <TabsTrigger value="libraries">Libraries</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="libraries" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search libraries by name or location..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredLibraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No libraries found</p>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredLibraries.map((library) => (
                <Card key={library.id} className="overflow-hidden">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={library.images[0] || "/placeholder.svg"}
                      alt={library.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{library.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{library.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {library.availableSeats} of {library.totalSeats} seats available
                        </span>
                        <Badge variant={library.availableSeats > 0 ? "default" : "destructive"}>
                          {library.availableSeats > 0 ? "Available" : "Full"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="default" className="w-full" disabled={library.availableSeats === 0} asChild>
                      <Link href={`/dashboard/member/book-seat/${library.id}`}>Book a Seat</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                <p className="text-muted-foreground">Book a seat at your favorite library</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{booking.libraryName}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end">
                          <Badge className="mr-2">{booking.status}</Badge>
                          <Badge variant="outline">{booking.seatName}</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Cancel Booking
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Past Bookings</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pastBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No past bookings</h3>
                <p className="text-muted-foreground">Your booking history will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastBookings.slice(0, 3).map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{booking.libraryName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end">
                          <Badge variant="secondary" className="mr-2">
                            {booking.status}
                          </Badge>
                          <Badge variant="outline">{booking.seatName}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pastBookings.length > 3 && (
                  <p className="text-center text-sm text-muted-foreground">
                    +{pastBookings.length - 3} more past bookings
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
