"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Armchair, CreditCard, Loader2 } from "lucide-react"
import toast from 'react-hot-toast'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
// import Navbar from "@/components/navbar"
// import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import type { Library, SeatType } from "@/types/library"
import { useAuth } from "@/lib/context/AuthContext"

// Interface for seat data from API
interface SeatData {
  id: string
  name: string
  position: unknown
  isAvailable: boolean
  isActive: boolean
  seatTypeId: string
  libraryId: string
  seatType: {
    id: string
    name: string
    pricePerHour: number
    description: string
    color: string
    amenities: string[]
    isActive: boolean
    libraryId: string
  }
  bookings: unknown[]
}

// Interface for availability API response
interface AvailabilitySeat {
  seatId: string
  name: string
  seatType: {
    id: string
    name: string
    pricePerHour: number
    description: string
    color: string
    amenities: string[]
  }
  isAvailable: boolean
  isActive: boolean
  bookedSlots: {
    bookingId: string
    startTime: string
    endTime: string
    status: string
  }[]
  totalBookings: number
}

interface LibraryData {
  id: string
  name: string
  address: string
  description: string
  email: string
  phone: string
}

// interface LibrarySeatsResponse {
//   success: boolean
//   data: {
//     library: LibraryData
//     seats: SeatData[]
//   }
// }

export default function SelectSeatPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const seatTypeId = searchParams.get("seatType")
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [library, setLibrary] = useState<LibraryData | null>(null)
  const [allSeats, setAllSeats] = useState<SeatData[]>([])
  const [filteredSeats, setFilteredSeats] = useState<SeatData[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Authentication check effect
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to book a seat', { duration: 2000 })
      router.push(`/auth/login?redirect=/libraries/${id}/book-seat/select${seatTypeId ? `?seatType=${seatTypeId}` : ''}`)
      return
    }
  }, [authLoading, user, router, id, seatTypeId])

  // Fetch initial library and seats data
  useEffect(() => {
    const fetchLibraryAndSeats = async () => {
      if (!id || authLoading || !user) return

      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/seats/library/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Library not found')
          }
          throw new Error('Failed to fetch library data')
        }

        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch library data')
        }

        setLibrary(data.data.library)
        setAllSeats(data.data.seats)

        // Filter seats by seat type if specified
        if (seatTypeId) {
          const filtered = data.data.seats.filter((seat: SeatData) => seat.seatTypeId === seatTypeId)
          setFilteredSeats(filtered)
          
          if (filtered.length === 0) {
            toast.error('No seats found for the selected seat type', { duration: 2000 })
          }
        } else {
          setFilteredSeats(data.data.seats)
        }

      } catch (error) {
        console.error("Error fetching library data:", error)
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        setError(errorMessage)
        toast.error(errorMessage, { duration: 2000 })
      } finally {
        setLoading(false)
      }
    }

    fetchLibraryAndSeats()
  }, [id, seatTypeId, authLoading, user])

  // Effect to check availability when date changes
  useEffect(() => {
    const checkSeatAvailability = async (date: string) => {
      if (!id) return

      setLoadingAvailability(true)
      
      try {
        const params = new URLSearchParams({ date })
        if (seatTypeId) {
          params.append('seatTypeId', seatTypeId)
        }

        const response = await fetch(`/api/seats/library/${id}/availability?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to check seat availability')
        }

        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to check availability')
        }

        // Update seats with availability data
        const availabilityMap = new Map(
          data.data.availability.map((seat: AvailabilitySeat) => [seat.seatId, seat.isAvailable])
        )

        // Update filtered seats with availability status
        const updatedSeats = allSeats.map(seat => ({
          ...seat,
          isAvailable: availabilityMap.has(seat.id) ? Boolean(availabilityMap.get(seat.id)) : seat.isAvailable
        }))

        // Filter by seat type if specified
        const finalFilteredSeats = seatTypeId 
          ? updatedSeats.filter(seat => seat.seatTypeId === seatTypeId)
          : updatedSeats

        setFilteredSeats(finalFilteredSeats)

        // Clear selected seat if it's no longer available
        if (selectedSeat && !availabilityMap.get(selectedSeat)) {
          setSelectedSeat(null)
          toast.error('Your selected seat is no longer available for this date', { duration: 2000 })
        }

        const availableCount = data.data.availability.filter((seat: AvailabilitySeat) => seat.isAvailable).length
        toast.success(`Found ${availableCount} available seats for ${date}`, { duration: 2000 })

      } catch (error) {
        console.error("Error checking availability:", error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to check availability'
        toast.error(errorMessage, { duration: 2000 })
      } finally {
        setLoadingAvailability(false)
      }
    }

    if (selectedDate && allSeats.length > 0) {
      checkSeatAvailability(selectedDate)
    }
  }, [selectedDate, allSeats, seatTypeId, id, selectedSeat])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedSeat(null) // Clear selection when date changes
  }

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast.error('Please select a seat to continue', { duration: 2000 })
      return
    }

    setBookingInProgress(true)

    try {
      // Simulate API call - you can implement actual booking here later
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const selectedSeatData = filteredSeats.find(s => s.id === selectedSeat)
      toast.success(`Your ${selectedSeatData?.seatType.name} seat has been booked for ${duration} hour${duration > 1 ? "s" : ""}`, { duration: 2000 })

      router.push(`/dashboard/member`)
    } catch (error) {
      console.error("Error booking seat:", error)
      toast.error('There was an error booking your seat. Please try again.', { duration: 2000 })
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* <Navbar /> */}
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">
              {authLoading ? "Authenticating..." : "Loading seat selection..."}
            </p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  if (error || !library) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* <Navbar /> */}
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-medium">
              {error || 'Library not found'}
            </p>
            <p className="text-muted-foreground max-w-md">
              {error ? 'Please try again later or contact support if the problem persists.' : 'The library you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/libraries")}>
                Back to Libraries
              </Button>
              {error && (
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }

  // Get seat type info from the first filtered seat (they all have same seat type)
  const selectedSeatType = filteredSeats.length > 0 ? filteredSeats[0].seatType : null
  const totalPrice = selectedSeatType ? selectedSeatType.pricePerHour * duration : 0

  return (
    <div className="flex min-h-screen flex-col md:pb-30">
      {/* <Navbar /> */}

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="bg-gray-400">
              <Link href={`/libraries/${id}/book-seat`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Seat Types
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Select a {selectedSeatType?.name || 'Seat'}</h1>
            <p className="text-muted-foreground">Choose an available seat at {library.name}</p>
          </div>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Choose the date for your booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="booking-date">Booking Date</Label>
                  <Input
                    id="booking-date"
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {loadingAvailability && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking availability...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Seat Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Seat</CardTitle>
                  <CardDescription>Available seats are shown in green, occupied seats are disabled</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="mb-6 p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">FRONT (Entrance)</p>
                  </div> */}

                  {filteredSeats.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No seats available for the selected criteria</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-3">
                      {filteredSeats.map((seat) => (
                        <Button
                          key={seat.id}
                          variant={selectedSeat === seat.id ? "default" : "outline"}
                          className={`h-12 bg-green-100 ${!seat.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!seat.isAvailable}
                          onClick={() => setSelectedSeat(seat.id)}
                        >
                          <Armchair className="mr-2 h-4 w-4" />
                          {seat.name}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/50"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-muted"></div>
                      <span className="text-sm">Occupied</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Duration Selection */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Select Duration</CardTitle>
                  <CardDescription>Choose how long you want to book the seat for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Duration (hours)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          max="8"
                          value={duration}
                          onChange={(e) => setDuration(Number.parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Rate</Label>
                        <div className="mt-2 text-lg font-medium">₹{selectedSeatType?.pricePerHour || 0}/hour</div>
                      </div>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <RadioGroup defaultValue="card" className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi">UPI</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="wallet" id="wallet" />
                          <Label htmlFor="wallet">Library Wallet</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Library</span>
                      <span>{library.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seat Type</span>
                      <span>{selectedSeatType?.name || 'N/A'}</span>
                    </div>
                    {selectedSeat && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seat Number</span>
                        <span>{filteredSeats.find((s) => s.id === selectedSeat)?.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>
                        {duration} hour{duration > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate</span>
                      <span>₹{selectedSeatType?.pricePerHour || 0}/hour</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (18% GST)</span>
                      <span className="text-muted-foreground">₹{(totalPrice * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Final Amount</span>
                      <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gray-500" onClick={handleBookSeat} disabled={!selectedSeat || bookingInProgress}>
                    {bookingInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4 " />
                        Pay & Book Seat
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Seat Type Info */}
              {selectedSeatType && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedSeatType.color }} />
                      <CardTitle className="text-lg">{selectedSeatType.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{selectedSeatType.description}</p>
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Amenities</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedSeatType.amenities.map((amenity: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {/* <Footer /> */}
      </div>
    </div>
  )
}
