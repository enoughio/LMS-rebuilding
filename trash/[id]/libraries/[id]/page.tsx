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
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library, LibraryAmenity, SeatType } from "@/types/library"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"

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
  meeting_rooms: "Meeting Rooms",
  computers: "Computers",
}

// Mock seat types for demonstration
const mockSeatTypes: SeatType[] = [
  {
    id: "st-1",
    name: "Standard Desk",
    description: "Basic desk with chair and power outlet",
    pricePerHour: 50,
    amenities: ["Power Outlet", "Reading Light"],
    color: "#3B82F6",
    libraryId: "lib-1",
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
    libraryId: "lib-1",
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
    libraryId: "lib-1",
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
    libraryId: "lib-1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export default function LibraryDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [library, setLibrary] = useState<Library | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true)
      try {
        const data = await mockLibraryService.getLibrary(id as string)
        // Add mock seat types to the library data
        const libraryWithSeatTypes = {
          ...data,
          seatTypes: mockSeatTypes,
        }
        setLibrary(libraryWithSeatTypes)
      } catch (error) {
        console.error("Error fetching library:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLibrary()
    }
  }, [id])

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

  // const handleBuyMembership = () => {
  //   if (!user) {
  //     toast({
  //       title: "Login Required",
  //       description: "Please login to purchase membership",
  //       variant: "destructive",
  //     })
  //     router.push("/login")
  //     return
  //   }

  //   router.push(`/libraries/${id}/membership`)
  // }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading library details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!library) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-8">
          {/* Library Header */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{library.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <p>{library.address}</p>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>
                    {library.rating.toFixed(1)} ({library.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={library.images[activeImageIndex] || "/placeholder.svg"}
                  alt={library.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {library.images.slice(0, 6).map((image, index) => (
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
                ))}
              </div>
            </div>
          </div>

          {/* Library Details */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="seats">Seat Types</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="hours">Opening Hours</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">About</h2>
                    <p className="mt-2 text-muted-foreground">{library.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-semibold">Seats</h2>
                    <div className="mt-2 flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold">{library.availableSeats}</p>
                        <p className="text-sm text-muted-foreground">Available now</p>
                      </div>
                      <Separator orientation="vertical" className="h-10" />
                      <div>
                        <p className="text-2xl font-bold">{library.totalSeats}</p>
                        <p className="text-sm text-muted-foreground">Total seats</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seats" className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Available Seat Types</h2>
                    <p className="text-muted-foreground">Choose from different seat types based on your needs</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {library.seatTypes?.map((seatType) => (
                      <Card key={seatType.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seatType.color }} />
                              <CardTitle className="text-lg">{seatType.name}</CardTitle>
                            </div>
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
                          <Button
                            className="w-full"
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
                            Book {seatType.name}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {library.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {amenityIcons[amenity]}
                        </div>
                        <span>{amenityLabels[amenity]}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="hours" className="space-y-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {Object.entries(library.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between rounded-md border p-3">
                        <span className="capitalize">{day}</span>
                        <span>
                          {hours.open === "closed"
                            ? "Closed"
                            : `${hours.open} - ${hours.close === "closed" ? "Closed" : hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <Button className="w-full bg-gray-400" onClick={handleBookSeat}>
                    <Armchair className="mr-2 h-4 w-4" />
                    Book Any Seat
                  </Button>
                </CardFooter>
              </Card>

              {/* Membership Plans */}
              <Card>
                <CardHeader>
                  <CardTitle>Membership Plans</CardTitle>
                  <CardDescription>Choose a plan that suits your needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {library.membershipPlans.map((plan) => (
                    <div key={plan.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <Badge variant="outline">₹{plan.price}/month</Badge>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {feature}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
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
                            router.push("/login")
                            return
                          }
                          router.push(`/libraries/${id}/membership?plan=${plan.id}`)
                        }}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Buy Plan
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
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
