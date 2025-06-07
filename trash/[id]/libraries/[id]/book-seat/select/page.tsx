"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Armchair, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library, SeatType } from "@/types/library"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

// Mock seat type for this page
type MockSeat = {
  id: string
  number: string
  seatTypeId: string
  isAvailable: boolean
}

// Mock seat data
const generateMockSeats = (seatTypeId: string, count = 20): MockSeat[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `seat-${seatTypeId}-${i + 1}`,
    number: `${String.fromCharCode(65 + Math.floor(i / 5))}${(i % 5) + 1}`,
    seatTypeId,
    isAvailable: Math.random() > 0.3, // 70% chance of being available
  }))
}

export default function SelectSeatPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const seatTypeId = searchParams.get("seatType")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [library, setLibrary] = useState<Library | null>(null)
  const [seatType, setSeatType] = useState<SeatType | null>(null)
  const [seats, setSeats] = useState<MockSeat[]>([])
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)
  const [duration, setDuration] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [bookingInProgress, setBookingInProgress] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (!seatTypeId) {
          toast({
            title: "Error",
            description: "No seat type selected",
            variant: "destructive",
          })
          router.push(`/libraries/${id}/book-seat`)
          return
        }

        const libraryData = await mockLibraryService.getLibrary(id as string)
        setLibrary(libraryData)

        // Mock seat types
        const mockSeatTypes: SeatType[] = [
          {
            id: "st-1",
            name: "Standard Desk",
            description: "Basic desk with chair and power outlet",
            pricePerHour: 50,
            amenities: ["Power Outlet", "Reading Light"],
            color: "#3B82F6",
            libraryId: id as string,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "st-2",
            name: "Premium Desk",
            description: "Spacious desk with ergonomic chair and premium amenities",
            pricePerHour: 100,
            amenities: ["Power Outlet", "Reading Light", "USB Charging", "Privacy Screen"],
            color: "#10B981",
            libraryId: id as string,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "st-3",
            name: "Quiet Zone",
            description: "Silent study area with noise-canceling environment",
            pricePerHour: 75,
            amenities: ["Power Outlet", "Reading Light", "Noise Canceling"],
            color: "#8B5CF6",
            libraryId: id as string,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          {
            id: "st-4",
            name: "Computer Station",
            description: "Workstation with computer and high-speed internet",
            pricePerHour: 120,
            amenities: ["Computer", "High-Speed Internet", "Power Outlet", "Printer Access"],
            color: "#F59E0B",
            libraryId: id as string,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ]

        const selectedSeatType = mockSeatTypes.find((st) => st.id === seatTypeId)
        if (!selectedSeatType) {
          toast({
            title: "Error",
            description: "Invalid seat type",
            variant: "destructive",
          })
          router.push(`/libraries/${id}/book-seat`)
          return
        }

        setSeatType(selectedSeatType)

        // Generate mock seats for this seat type
        const mockSeats = generateMockSeats(seatTypeId)
        setSeats(mockSeats)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load seat information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a seat",
        variant: "destructive",
      })
      router.push(`/login?redirect=/libraries/${id}/book-seat/select?seatType=${seatTypeId}`)
      return
    }

    if (id) {
      fetchData()
    }
  }, [id, seatTypeId, user, router, toast])

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast({
        title: "No Seat Selected",
        description: "Please select a seat to continue",
        variant: "destructive",
      })
      return
    }

    setBookingInProgress(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Booking Successful",
        description: `Your seat has been booked for ${duration} hour${duration > 1 ? "s" : ""}`,
      })

      router.push(`/dashboard/member`)
    } catch (error) {
      console.error("Error booking seat:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error booking your seat. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading seat selection...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!library || !seatType) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">Information not found</p>
            <Button variant="outline" onClick={() => router.push("/libraries")}>
              Back to Libraries
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const totalPrice = (seatType.pricePerHour || 0) * duration

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/libraries/${id}/book-seat`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Seat Types
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Select a {seatType.name}</h1>
            <p className="text-muted-foreground">Choose an available seat at {library.name}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Seat Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Seat</CardTitle>
                  <CardDescription>Available seats are shown in green, occupied seats are disabled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">FRONT (Entrance)</p>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {seats.map((seat) => (
                      <Button
                        key={seat.id}
                        variant={selectedSeat === seat.id ? "default" : "outline"}
                        className={`h-12 ${!seat.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!seat.isAvailable}
                        onClick={() => setSelectedSeat(seat.id)}
                      >
                        <Armchair className="mr-2 h-4 w-4" />
                        {seat.number}
                      </Button>
                    ))}
                  </div>

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
                        <div className="mt-2 text-lg font-medium">₹{seatType.pricePerHour}/hour</div>
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
                      <span>{seatType.name}</span>
                    </div>
                    {selectedSeat && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seat Number</span>
                        <span>{seats.find((s) => s.id === selectedSeat)?.number}</span>
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
                      <span>₹{seatType.pricePerHour}/hour</span>
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
                  <Button className="w-full" onClick={handleBookSeat} disabled={!selectedSeat || bookingInProgress}>
                    {bookingInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay & Book Seat
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Seat Type Info */}
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seatType.color }} />
                    <CardTitle className="text-lg">{seatType.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{seatType.description}</p>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Amenities</span>
                    <div className="flex flex-wrap gap-1">
                      {seatType.amenities?.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}
