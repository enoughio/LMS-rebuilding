"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, Check, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import { useAuth } from "@/lib/auth-provider"
import type { Library, Seat } from "@/types/library"

export default function BookSeatDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [library, setLibrary] = useState<Library | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("13:00")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const libraryData = await mockLibraryService.getLibrary(id as string)
        setLibrary(libraryData)

        // Fetch available seats for the selected date
        if (libraryData) {
          const seatsData = await mockLibraryService.getAvailableSeats(id as string, bookingDate)
          setSeats(seatsData)
        }
      } catch (error) {
        console.error("Error fetching library data:", error)
        toast({
          title: "Error",
          description: "Failed to load library data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, bookingDate, toast])

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setBookingDate(newDate)
    setSelectedSeat(null)

    try {
      setLoading(true)
      const seatsData = await mockLibraryService.getAvailableSeats(id as string, newDate)
      setSeats(seatsData)
    } catch (error) {
      console.error("Error fetching seats for date:", error)
      toast({
        title: "Error",
        description: "Failed to load seats for the selected date",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookSeat = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a seat",
        variant: "destructive",
      })
      return
    }

    if (!selectedSeat) {
      toast({
        title: "Seat Required",
        description: "Please select a seat to book",
        variant: "destructive",
      })
      return
    }

    if (!library) {
      toast({
        title: "Error",
        description: "Library information not available",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const selectedSeatObj = seats.find((seat) => seat.id === selectedSeat)

      if (!selectedSeatObj) {
        throw new Error("Selected seat not found")
      }

      await mockLibraryService.bookSeat({
        userId: user.id,
        userName: user.name,
        seatId: selectedSeat,
        seatName: selectedSeatObj.name,
        libraryId: library.id,
        libraryName: library.name,
        date: bookingDate,
        startTime,
        endTime,
      })

      toast({
        title: "Booking Successful",
        description: "Your seat has been booked successfully",
      })

      router.push("/dashboard/member/book-seat")
    } catch (error) {
      console.error("Error booking seat:", error)
      toast({
        title: "Booking Failed",
        description: "Failed to book the seat. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !library) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading library details...</p>
        </div>
      </div>
    )
  }

  if (!library) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium">Library not found</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/member/book-seat")}>
            Back to Libraries
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="w-fit" onClick={() => router.push("/dashboard/member/book-seat")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Libraries
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
        <p className="text-muted-foreground">{library.address}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Seat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="booking-date">Booking Date</Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={bookingDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <Separator />

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : seats.filter((seat) => seat.isAvailable).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
                  <p className="text-lg font-medium">No seats available</p>
                  <p className="text-muted-foreground">Try selecting a different date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Available Seats</h3>
                    <p className="text-sm text-muted-foreground">
                      {seats.filter((seat) => seat.isAvailable).length} of {seats.length} seats available
                    </p>
                  </div>

                  <RadioGroup value={selectedSeat || ""} onValueChange={setSelectedSeat}>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {seats.map((seat) => (
                        <div key={seat.id}>
                          <RadioGroupItem
                            value={seat.id}
                            id={seat.id}
                            disabled={!seat.isAvailable}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={seat.id}
                            className="flex flex-col items-center justify-center rounded-lg border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:text-primary"
                          >
                            <div
                              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
                                seat.type === "quiet_zone"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                                  : seat.type === "computer"
                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200"
                                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {seat.isAvailable && selectedSeat === seat.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                seat.name.charAt(0)
                              )}
                            </div>
                            <span className="text-sm font-medium">{seat.name}</span>
                            <span className="text-xs capitalize text-muted-foreground">
                              {seat.type.replace("_", " ")}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium">{library.name}</h3>
                <p className="text-sm text-muted-foreground">{library.address}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date</span>
                  </div>
                  <span>{new Date(bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time</span>
                  </div>
                  <span>
                    {startTime} - {endTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Selected Seat</span>
                  {selectedSeat ? (
                    <Badge variant="outline">
                      {seats.find((seat) => seat.id === selectedSeat)?.name || "Unknown Seat"}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">None selected</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!selectedSeat || submitting} onClick={handleBookSeat}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Library Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image src={library.images[0] || "/placeholder.svg"} alt={library.name} fill className="object-cover" />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Opening Hours</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(library.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{day}</span>
                      <span>
                        {hours.open === "closed"
                          ? "Closed"
                          : `${hours.open} - ${hours.close === "closed" ? "Closed" : hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
