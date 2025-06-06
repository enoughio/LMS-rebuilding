"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Armchair, Calendar, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library, SeatType } from "@/types/library"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export default function BookSeatPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const selectedSeatTypeId = searchParams.get("seatType")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [library, setLibrary] = useState<Library | null>(null)
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true)
      try {
        const data = await mockLibraryService.getLibrary(id as string)
        setLibrary(data)

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

        setSeatTypes(mockSeatTypes)
      } catch (error) {
        console.error("Error fetching library:", error)
        toast({
          title: "Error",
          description: "Failed to load library information",
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
      router.push(
        `/login?redirect=/libraries/${id}/book-seat${selectedSeatTypeId ? `?seatType=${selectedSeatTypeId}` : ""}`,
      )
      return
    }

    if (id) {
      fetchLibrary()
    }
  }, [id, user, router, toast, selectedSeatTypeId])

  const handleSelectSeatType = (seatTypeId: string) => {
    router.push(`/libraries/${id}/book-seat/select?seatType=${seatTypeId}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading seat booking...</p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }

  if (!library) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* <Navbar /> */}
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-medium">Library not found</p>
            <Button variant="outline" onClick={() => router.push("/libraries")}>
              Back to Libraries
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // If a specific seat type is selected, redirect to the seat selection page
  if (selectedSeatTypeId) {
    const seatType = seatTypes.find((st) => st.id === selectedSeatTypeId)
    if (seatType) {
      router.push(`/libraries/${id}/book-seat/select?seatType=${selectedSeatTypeId}`)
      return (
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="container flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Redirecting to seat selection...</p>
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/libraries/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Book a Seat</h1>
            <p className="text-muted-foreground">Choose a seat type at {library.name}</p>
          </div>

          {/* Library Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{library.name}</CardTitle>
              <CardDescription>{library.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Open today:{" "}
                  {
                    library.openingHours[
                      ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
                        new Date().getDay()
                      ]
                    ].open
                  }{" "}
                  -{" "}
                  {
                    library.openingHours[
                      ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
                        new Date().getDay()
                      ]
                    ].close
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {library.availableSeats} seats available out of {library.totalSeats}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Seat Types */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Seat Type</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {seatTypes.map((seatType) => (
                <Card key={seatType.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: seatType.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{seatType.name}</CardTitle>
                      <Badge variant="outline">₹{seatType.pricePerHour}/hr</Badge>
                    </div>
                    <CardDescription>{seatType.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Amenities</span>
                      <div className="flex flex-wrap gap-1">
                        {seatType.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Armchair className="h-4 w-4" />
                      <span>Available seats: {Math.floor(Math.random() * 10) + 1}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleSelectSeatType(seatType.id)}>
                      Select {seatType.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
