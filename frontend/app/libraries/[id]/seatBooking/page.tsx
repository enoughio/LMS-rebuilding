"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, Check, Clock, Loader2, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/lib/context/AuthContext'

// Define types for our seat booking
interface Seat {
  id: string
  name: string
  seatType: string
  libraryId: string
  bookings?: {
    date: Date
    startTime: string
    endTime: string
  }[]
}

interface Library {
  id: string
  name: string
  address: string
  images?: string[]
  openingHours?: {
    [key: string]: {
      open: string
      close: string
    }
  }
}

interface SeatAvailability {
  seatId: string
  name: string
  type: string
  isAvailable: boolean
  bookedSlots: {
    date: Date
    start: string
    end: string
  }[]
}

export default function BookSeatDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [library, setLibrary] = useState<Library | null>(null)
  const [seats, setSeats] = useState<SeatAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("13:00")
  const [submitting, setSubmitting] = useState(false)

  // Fetch library details
  const fetchLibrary = async (libraryId: string) => {
    try {
      const response = await fetch(`/api/libraries/${libraryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch library')
      }
      const result = await response.json()
      if (result.success) {
        setLibrary(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch library')
      }
    } catch (error) {
      console.error('Error fetching library:', error)
      toast({
        title: "Error",
        description: "Failed to load library data",
        variant: "destructive",
      })
    }
  }

  // Fetch seat availability
  const fetchSeatAvailability = async (libraryId: string, date: string) => {
    try {
      // Add error handling for the API endpoint
      if (!libraryId) {
        throw new Error('Library ID is required')
      }
      
      const response = await fetch(`/api/seats/library/${libraryId}/availability?date=${date}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch seat availability: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        // Check if data exists and is an array
        if (!result.data || !Array.isArray(result.data)) {
          setSeats([])
          return
        }
        
        // Transform the data to check availability for the selected time slot
        const transformedSeats = result.data.map((seat: any) => ({
          ...seat,
          id: seat.seatId,
          type: seat.type,
          isAvailable: checkSeatAvailability(seat, startTime, endTime)
        }))
        setSeats(transformedSeats)
      } else {
        throw new Error(result.message || 'Failed to fetch seat availability')
      }
    } catch (error) {
      console.error('Error fetching seat availability:', error)
      // Set empty seats array to prevent errors
      setSeats([])
      toast({
        title: "Error",
        description: "Failed to load seat availability",
        variant: "destructive",
      })
    }
  }

  // Check if a seat is available for the selected time slot
  const checkSeatAvailability = (seat: any, start: string, end: string): boolean => {
    if (!seat.bookedSlots || seat.bookedSlots.length === 0) {
      return true
    }

    return !seat.bookedSlots.some((slot: any) => {
      return (
        (start >= slot.start && start < slot.end) ||
        (end > slot.start && end <= slot.end) ||
        (start <= slot.start && end >= slot.end)
      )
    })
  }

  // Update seat availability when time changes
  const updateSeatAvailability = () => {
    setSeats(prevSeats => 
      prevSeats.map(seat => ({
        ...seat,
        isAvailable: checkSeatAvailability(seat, startTime, endTime)
      }))
    )
    setSelectedSeat(null) // Reset selection when availability changes
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        // Fetch library data
        await fetchLibrary(id as string)
        
        // Fetch seat availability
        await fetchSeatAvailability(id as string, bookingDate)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, bookingDate])

  // Update availability when time slots change
  useEffect(() => {
    if (seats.length > 0) {
      updateSeatAvailability()
    }
  }, [startTime, endTime])

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setBookingDate(newDate)
    setSelectedSeat(null)

    if (id) {
      setLoading(true)
      try {
        await fetchSeatAvailability(id as string, newDate)
      } finally {
        setLoading(false)
      }
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

    // Validate time selection
    if (startTime >= endTime) {
      toast({
        title: "Invalid Time",
        description: "End time must be after start time",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const bookingData = {
        seatId: selectedSeat,
        date: bookingDate,
        startTime,
        endTime,
        paymentMedium: 'online', // Default values, you can make these configurable
        paymentMethod: 'card'
      }

      const response = await fetch('/api/seats/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to book seat')
      }

      toast({
        title: "Booking Successful",
        description: "Your seat has been booked successfully",
      })

      router.push("/libraries")
    } catch (error: any) {
      console.error("Error booking seat:", error)
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book the seat. Please try again.",
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
          <Button variant="outline" onClick={() => router.push("/libraries")}>
            Back to Libraries
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="w-fit" onClick={() => router.push("/libraries")}>
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
                  <Input 
                    id="start-time" 
                    type="time" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                  />
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
                  <p className="text-muted-foreground">Try selecting a different date or time</p>
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
                            className={`flex flex-col items-center justify-center rounded-lg border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:text-primary ${
                              !seat.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
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
                            {!seat.isAvailable && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Booked
                              </Badge>
                            )}
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
              <Button 
                className="w-full" 
                disabled={!selectedSeat || submitting || startTime >= endTime} 
                onClick={handleBookSeat}
              >
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
              {/* Image placeholder section */}
              {library.images && library.images.length > 0 && library.images[0] ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <Image 
                    src={library.images[0].startsWith('/') || library.images[0].startsWith('http') 
                      ? library.images[0] 
                      : `/${library.images[0]}`} 
                    alt={library.name} 
                    fill 
                    className="object-cover" 
                    onError={(e) => {
                      // Handle image load error by showing placeholder
                      console.log('Image failed to load, showing placeholder')
                      // Make the parent component re-render with the placeholder
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      setTimeout(() => {
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex flex-col items-center gap-2 text-muted-foreground w-full h-full justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                              </svg>
                              <p class="text-sm">No image available</p>
                            </div>
                          `
                        }
                      }, 100)
                    }}
                  />
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}

              {/* Opening hours section */}
              {library.openingHours && Object.keys(library.openingHours).length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Opening Hours</h3>
                  <div className="grid grid-cols-1 gap-2 text-sm">
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
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Opening Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Opening hours information not available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
