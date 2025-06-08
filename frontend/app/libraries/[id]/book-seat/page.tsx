"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Armchair, Calendar, Clock, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
// import { Navbar } from "@/components/navbar"
// import { Footer } from "@/components/footer"

import type { Library, SeatType } from "@/types/library"
import { useAuth } from "@/lib/context/AuthContext" 
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLibraryData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)
      
      try {
        // Fetch library data and seat types in parallel
        const [libraryResponse, seatTypesResponse] = await Promise.all([
          fetch(`/api/libraries/${id}`),
          fetch(`/api/seats/seattype/libraries/${id}`)
        ])

        // Check if both requests were successful
        if (!libraryResponse.ok) {
          if (libraryResponse.status === 404) {
            throw new Error('Library not found')
          }
          throw new Error('Failed to fetch library data')
        }

        if (!seatTypesResponse.ok) {
          console.warn('Failed to fetch seat types:', seatTypesResponse.status)
          // We'll continue without seat types if this fails
        }

        const libraryData = await libraryResponse.json()
        
        if (!libraryData.success) {
          throw new Error(libraryData.message || 'Failed to fetch library data')
        }

        setLibrary(libraryData.data)

        // Handle seat types response
        if (seatTypesResponse.ok) {
          const seatTypesData = await seatTypesResponse.json()
          if (seatTypesData.success) {
            setSeatTypes(seatTypesData.data || [])
          } else {
            console.warn('Seat types fetch unsuccessful:', seatTypesData.message)
            setSeatTypes([])
          }
        } else {
          setSeatTypes([])
        }

      } catch (error) {
        console.error("Error fetching library data:", error)
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        setError(errorMessage)
        
        toast({
          title: "Error",
          description: errorMessage,
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
        `/auth/login?redirect=/libraries/${id}/book-seat${selectedSeatTypeId ? `?seatType=${selectedSeatTypeId}` : ""}`,
      )
      return
    }

    fetchLibraryData()
  }, [id, user, router, toast, selectedSeatTypeId])

  const handleSelectSeatType = (seatTypeId: string) => {
    router.push(`/libraries/${id}/book-seat/select?seatType=${seatTypeId}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading seat booking...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !library) {
    return (
      <div className="flex min-h-screen flex-col">
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
          {/* <Navbar /> */}
          <div className="container flex flex-1 items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg font-medium">Redirecting to seat selection...</p>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:pb-30 p-2">
      {/* <Navbar /> */}

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
                  {(() => {
                    const today = new Date().getDay() // 0 = Sunday, 1 = Monday, etc.
                    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
                    
                    if (library.openingHours) {
                      // Handle array format (new API format)
                      if (Array.isArray(library.openingHours)) {
                        const todaysHours = library.openingHours.find(oh => oh.dayOfWeek === today)
                        if (todaysHours && !todaysHours.isClosed) {
                          return `Open today: ${todaysHours.openTime} - ${todaysHours.closeTime}`
                        } else {
                          return "Closed today"
                        }
                      } 
                      // Handle legacy object format
                      else if (typeof library.openingHours === 'object') {
                        const dayKey = dayNames[today] as keyof typeof library.openingHours
                        const todaysHours = library.openingHours[dayKey]
                        if (todaysHours) {
                          return `Open today: ${todaysHours.open} - ${todaysHours.close}`
                        }
                      }
                    }
                    return "Hours not available"
                  })()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {(() => {
                    // Calculate totals from seat types
                    const totalSeats = seatTypes.reduce((sum, st) => sum + (st.totalSeats || 0), 0)
                    const availableSeats = seatTypes.reduce((sum, st) => sum + (st.availableSeats || 0), 0)
                    
                    if (totalSeats > 0) {
                      return `${availableSeats} seats available out of ${totalSeats}`
                    }
                    return "Seat availability information not available"
                  })()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Seat Types */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select Seat Type</h2>
            {seatTypes.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Armchair className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Seat Types Available</h3>
                  <p className="text-muted-foreground">
                    This library doesn&apos;t have any seat types configured yet. Please check back later or contact the library directly.
                  </p>
                </CardContent>
              </Card>
            ) : (
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
                        {seatType.amenities && seatType.amenities.length > 0 ? (
                          seatType.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No specific amenities</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Armchair className="h-4 w-4" />
                      <span>
                        Available seats: {seatType.availableSeats ?? 0}
                        {seatType.totalSeats && (
                          <span className="ml-1">/ {seatType.totalSeats}</span>
                        )}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="self-end">
                    <Button 
                      className="w-full bg-gray-500" 
                      onClick={() => handleSelectSeatType(seatType.id)}
                      disabled={(seatType.availableSeats ?? 0) === 0}
                    >
                      {(seatType.availableSeats ?? 0) === 0 ? 'No Seats Available' : `Select ${seatType.name}`}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {/* <Footer /> */}
      </div>
    </div>
  )
}
