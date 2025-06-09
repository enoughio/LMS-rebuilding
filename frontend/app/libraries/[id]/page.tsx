"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  Calendar,
  Clock,
  Coffee,
  Loader2,
  Monitor,
  Star,
  Users,
  VolumeX,
  Wifi,
  Zap,
  Armchair,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Library, LibraryAmenity, SeatType } from "@/types/library"
import { useAuth } from "@/lib/context/AuthContext" 
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Map amenity to icon
const amenityIcons: Record<LibraryAmenity, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  ac: <Zap className="h-4 w-4" />,
  cafe: <Coffee className="h-4 w-4" />,
  power_outlets: <Zap className="h-4 w-4" />,
  quiet_zones: <VolumeX className="h-4 w-4" />,
  meeting_rooms: <Users className="h-4 w-4" />,
  computers: <Monitor className="h-4 w-4" />,
}

// Map amenity to label
const amenityLabels: Record<LibraryAmenity, string> = {
  wifi: "Wi-Fi",
  ac: "Air Conditioning",
  cafe: "Café",
  power_outlets: "Power Outlets",
  quiet_zones: "Quiet Zones",
  meeting_rooms: "Meeting Rooms",  computers: "Computers",
}

export default function LibraryDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [library, setLibrary] = useState<Library | null>(null)
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
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

    fetchLibraryData()
  }, [id, toast])

  const handleBookSeat = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a seat",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    router.push(`/libraries/${id}/book-seat`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading library details...</p>
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
              <Button  onClick={() => router.push("/libraries")}>
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

  return (
    <div className="flex min-h-screen flex-col w-full p-2">

      <div className="container py-6 md:py-8 w-full">
        <div className="flex flex-col gap-8">
          {/* Library Header */}
          <div className="flex flex-col gap-4">            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{library.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <p>{library.address}</p>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>
                    {(library.rating || 0).toFixed(1)} ({library.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={(library.images && library.images.length > 0 ? library.images[activeImageIndex] : null) || "/placeholder.svg"}
                  alt={library.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {library.images && library.images.length > 0 ? (
                  library.images.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square cursor-pointer overflow-hidden rounded-md ${
                        index === activeImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${library.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">No other images available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Library Details */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 ">
            <div className="lg:col-span-2">
              <Tabs   defaultValue="overview">
                <TabsList className="mb-4 rounded-lg gap-0">
                  <TabsTrigger className="border-2 text-xs p-1.5  sm:text-xl" value="overview">Overview</TabsTrigger>
                  <TabsTrigger className="border-2 text-xs p-1.5  sm:text-xl" value="seats">Seat Types</TabsTrigger>
                  <TabsTrigger className="border-2 text-xs p-1.5  sm:text-xl" value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger className="border-2 text-xs p-1.5  sm:text-xl" value="hours">Opening Hours</TabsTrigger>
                </TabsList>               
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="bg-gray-100 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold ">About</h2>
                    <p className="mt-2 text-muted-foreground">{library.description}</p>
                  </div>

                  <Separator />

                  <div className="bg-gray-100 p-5 rounded-lg">
                    <h2 className="text-xl font-semibold  ">Seats</h2>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex flex-col items-center text-2xl ">
                        <p className="text-3xl font-bold">
                          {seatTypes.reduce((total, seatType) => total + (seatType.availableSeats || 0), 0)}
                        </p>
                        <p className=" text-2xl text-muted-foreground">Available now</p>
                      </div>
                      <Separator orientation="vertical" className="h-10" />
                      <div className="flex flex-col items-center">
                        <p className="text-3xl font-bold">
                          {seatTypes.reduce((total, seatType) => total + (seatType.totalSeats || 0), 0)}
                        </p>
                        <p className="text-2xl text-muted-foreground">Total seats</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>                <TabsContent value="seats" className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Available Seat Types</h2>
                    <p className="text-muted-foreground">Choose from different seat types based on your needs</p>
                  </div>

                  {seatTypes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {seatTypes.map((seatType: SeatType) => (
                        <Card key={seatType.id} className="relative">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seatType.color }} />
                                <CardTitle className="text-lg">{seatType.name}</CardTitle>
                              </div>
                              <Badge variant="outline">₹{seatType.pricePerHour || 0}/hr</Badge>
                            </div>
                            <CardDescription>{seatType.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <span className="text-sm font-medium">Amenities</span>
                              <div className="flex flex-wrap gap-1">
                                {(seatType.amenities || []).map((amenity: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Armchair className="h-4 w-4" />
                                <span>Available: {seatType.availableSeats || 0}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <span>Total: {seatType.totalSeats || 0}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full bg-gray-400"
                              disabled={(seatType.availableSeats || 0) === 0}
                              onClick={() => {
                                if (!user) {
                                  toast({
                                    title: "Login Required",
                                    description: "Please login to book a seat",
                                    variant: "destructive",
                                  })
                                  router.push("/login")
                                  return
                                }
                                router.push(`/libraries/${id}/book-seat?seatType=${seatType.id}`)
                              }}
                            >
                              {(seatType.availableSeats || 0) === 0 ? 'Fully Booked' : `Book ${seatType.name}`}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Armchair className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No seat types available</p>
                      <p className="text-muted-foreground">This library hasn&apos;t configured any seat types yet.</p>
                    </div>
                  )}
                </TabsContent>                <TabsContent value="amenities" className="space-y-4">
                  {library.amenities && library.amenities.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {library.amenities.map((amenity: string) => {
                        // Convert amenity string to lowercase and replace spaces with underscores for mapping
                        const amenityKey = amenity.toLowerCase().replace(/\s+/g, '_') as LibraryAmenity
                        const icon = amenityIcons[amenityKey] || <Wifi className="h-4 w-4" />
                        const label = amenityLabels[amenityKey] || amenity
                        
                        return (
                          <div key={amenity} className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              {icon}
                            </div>
                            <span>{label}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Coffee className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No amenities listed</p>
                      <p className="text-muted-foreground">This library hasn&apos;t added any amenity information yet.</p>
                    </div>
                  )}
                </TabsContent>                <TabsContent value="hours" className="space-y-4">
                  {library.openingHours && Array.isArray(library.openingHours) ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {library.openingHours.map((hour) => {
                        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                        const dayName = dayNames[hour.dayOfWeek] || "Unknown"
                        
                        return (
                          <div key={hour.id || hour.dayOfWeek} className="flex items-center justify-between rounded-md border p-3">
                            <span className="capitalize">{dayName}</span>
                            <span>
                              {hour.isClosed
                                ? "Closed"
                                : `${hour.openTime} - ${hour.closeTime}`}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No opening hours available</p>
                      <p className="text-muted-foreground">Contact the library for their operating hours.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              {/* Quick Book Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Book</CardTitle>
                  <CardDescription>Book any available seat instantly</CardDescription>
                </CardHeader>
                <CardFooter>
                    {
                    !user ? (
                      <Link className="w-full bg-gray-400" href="/auth/login">
                        <Armchair className="mr-2 h-4 w-4" />
                        Login to Book
                      </Link>
                    ) : (
                        <Button className="w-full bg-gray-400" onClick={handleBookSeat}>
                    <Armchair className="mr-2 h-4 w-4" />
                    Book Any Seat
                  </Button>

                    )
                }

                </CardFooter>
              </Card>              {/* Membership Plans */}
              <Card>
                <CardHeader>
                  <CardTitle>Membership Plans</CardTitle>
                  <CardDescription>Choose a plan that suits your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {library.membershipPlans && library.membershipPlans.length > 0 ? (
                    library.membershipPlans.map((plan) => (
                      <div key={plan.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant="outline">₹{plan.price}/month</Badge>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {plan.features?.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {feature}
                            </li>
                          ))}
                          {plan.features && plan.features.length > 3 && (
                            <li className="text-sm text-muted-foreground">• +{plan.features.length - 3} more features</li>
                          )}
                        </ul>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            if (!user) {
                              toast({
                                title: "Login Required",
                                description: "Please login to purchase membership",
                                variant: "destructive",
                              })
                              router.push("/auth/login")
                              return
                            }
                            router.push(`/libraries/${id}/membership?plan=${plan.id}`)
                          }}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Buy Plan
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium">No membership plans available</p>
                      <p className="text-muted-foreground">This library hasn&apos;t configured any membership plans yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {library.openingHours && Array.isArray(library.openingHours) ? (() => {
                        const today = new Date().getDay()
                        const todayHours = library.openingHours.find(h => h.dayOfWeek === today)
                        if (todayHours) {
                          return todayHours.isClosed ? "Closed today" : `Open today: ${todayHours.openTime} - ${todayHours.closeTime}`
                        }
                        return "Hours not available"
                      })() : "Hours not available"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {seatTypes.reduce((total, seatType) => total + (seatType.availableSeats || 0), 0)} seats available out of {seatTypes.reduce((total, seatType) => total + (seatType.totalSeats || 0), 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
