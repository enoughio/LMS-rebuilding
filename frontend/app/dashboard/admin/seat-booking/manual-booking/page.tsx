"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Check, Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Seat, SeatBooking } from "@/types/library"

// Mock users for dropdown
const mockUsers = [
  { id: "user-1", name: "John Member" },
  { id: "user-2", name: "Jane Member" },
  { id: "user-5", name: "Emma Wilson" },
  { id: "user-6", name: "Michael Brown" },
  { id: "user-7", name: "Sophia Garcia" },
]

export default function ManualBookingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [seats, setSeats] = useState<Seat[]>([])
  const [filteredSeats, setFilteredSeats] = useState<Seat[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [bookingDetails, setBookingDetails] = useState({
    userId: "",
    userName: "",
    startTime: "09:00",
    endTime: "13:00",
  })

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true)
      try {
        if (user?.libraryId) {
          const availableSeats = await mockLibraryService.getAvailableSeats(user.libraryId, selectedDate)
          setSeats(availableSeats)
          setFilteredSeats(availableSeats)
        }
      } catch (error) {
        console.error("Error fetching seats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeats()
  }, [user, selectedDate])

  useEffect(() => {
    // Apply filters
    let filtered = [...seats]

    if (searchQuery) {
      filtered = filtered.filter((seat) => seat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((seat) => seat.type === typeFilter)
    }

    setFilteredSeats(filtered)
  }, [seats, searchQuery, typeFilter])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleUserChange = (userId: string) => {
    const selectedUser = mockUsers.find((u) => u.id === userId)
    setBookingDetails({
      ...bookingDetails,
      userId,
      userName: selectedUser?.name || "",
    })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    })
  }

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeat(seat)
  }

  const handleBookSeat = async () => {
    if (!selectedSeat || !bookingDetails.userId || !user?.libraryId) {
      toast({
        title: "Missing Information",
        description: "Please select a seat and member",
        variant: "destructive",
      })
      return
    }

    try {
      const bookingData: Omit<SeatBooking, "id" | "createdAt" | "status"> = {
        userId: bookingDetails.userId,
        userName: bookingDetails.userName,
        seatId: selectedSeat.id,
        seatName: selectedSeat.name,
        libraryId: user.libraryId,
        libraryName: user.libraryName || "",
        date: selectedDate,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
      }

      await mockLibraryService.bookSeat(bookingData)

      toast({
        title: "Booking Successful",
        description: `Seat ${selectedSeat.name} has been booked for ${bookingDetails.userName}.`,
      })

      // Redirect to bookings page
      router.push("/dashboard/admin/seat-booking")
    } catch (error) {
      console.error("Error booking seat:", error)
      toast({
        title: "Booking Failed",
        description: "Failed to book the seat. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manual Seat Booking</h1>
        <p className="text-muted-foreground">Book a seat for a member</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Seats</CardTitle>
              <CardDescription>Select a seat to book</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search seats..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="quiet_zone">Quiet Zone</SelectItem>
                      <SelectItem value="computer">Computer</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="date" className="whitespace-nowrap">
                      Date:
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="w-[180px]"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredSeats.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center mt-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No seats available</h3>
                  <p className="text-muted-foreground">Try selecting a different date or adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-4">
                  {filteredSeats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`relative flex flex-col items-center justify-center rounded-lg border p-4 text-center hover:border-primary cursor-pointer transition-colors ${
                        selectedSeat?.id === seat.id ? "border-primary bg-primary/10" : ""
                      } ${!seat.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => seat.isAvailable && handleSeatSelect(seat)}
                    >
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                          seat.type === "quiet_zone"
                            ? "bg-blue-100 text-blue-600"
                            : seat.type === "computer"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {seat.name.split(" ")[1]}
                      </div>
                      <p className="font-medium">{seat.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{seat.type.replace("_", " ")}</p>
                      {selectedSeat?.id === seat.id && (
                        <div className="absolute right-2 top-2 rounded-full bg-primary p-1 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Enter booking information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Member</Label>
                <Select value={bookingDetails.userId} onValueChange={handleUserChange}>
                  <SelectTrigger id="userId">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={selectedDate} onChange={handleDateChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={bookingDetails.startTime}
                    onChange={handleTimeChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={bookingDetails.endTime}
                    onChange={handleTimeChange}
                  />
                </div>
              </div>

              {selectedSeat && (
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Selected Seat</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Seat:</span>
                    <span className="text-sm font-medium">{selectedSeat.name}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm capitalize">{selectedSeat.type.replace("_", " ")}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleBookSeat} disabled={!selectedSeat || !bookingDetails.userId}>
                Book Seat
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
