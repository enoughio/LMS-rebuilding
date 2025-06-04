"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Library } from "@/types/library"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit,
  Loader2,
  MapPin,
  Users,
  Wifi,
  Coffee,
  VolumeX,
  Zap,
  Monitor,
  UsersRound,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type {  LibraryAmenity } from "@/types/library"
import toast from "react-hot-toast"

// Map amenity to icon - updated to handle backend amenity format
const amenityMap: Record<string, { key: LibraryAmenity; icon: React.ReactNode }> = {
  "WiFi": { key: "wifi", icon: <Wifi className="h-4 w-4" /> },
  "wifi": { key: "wifi", icon: <Wifi className="h-4 w-4" /> },
  "AC": { key: "ac", icon: <Zap className="h-4 w-4" /> },
  "ac": { key: "ac", icon: <Zap className="h-4 w-4" /> },
  "Cafeteria": { key: "cafe", icon: <Coffee className="h-4 w-4" /> },
  "cafe": { key: "cafe", icon: <Coffee className="h-4 w-4" /> },
  "Power Outlets": { key: "power_outlets", icon: <Zap className="h-4 w-4" /> },
  "power_outlets": { key: "power_outlets", icon: <Zap className="h-4 w-4" /> },
  "Quiet Zones": { key: "quiet_zones", icon: <VolumeX className="h-4 w-4" /> },
  "quiet_zones": { key: "quiet_zones", icon: <VolumeX className="h-4 w-4" /> },
  "Study Rooms": { key: "meeting_rooms", icon: <Users className="h-4 w-4" /> },
  "meeting_rooms": { key: "meeting_rooms", icon: <Users className="h-4 w-4" /> },
  "Computers": { key: "computers", icon: <Monitor className="h-4 w-4" /> },
  "computers": { key: "computers", icon: <Monitor className="h-4 w-4" /> },
  "Parking": { key: "wifi", icon: <Wifi className="h-4 w-4" /> }, // Default fallback
}

const amenityIcons: Record<LibraryAmenity, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  ac: <Zap className="h-4 w-4" />,
  cafe: <Coffee className="h-4 w-4" />,
  power_outlets: <Zap className="h-4 w-4" />,
  quiet_zones: <VolumeX className="h-4 w-4" />,
  meeting_rooms: <Users className="h-4 w-4" />,
  computers: <Monitor className="h-4 w-4" />,
}

// Mock membership data
const mockMembershipData = [
  { plan: "Basic", active: 45, expired: 12, total: 57 },
  { plan: "Premium", active: 78, expired: 8, total: 86 },
  { plan: "Student", active: 32, expired: 5, total: 37 },
]

// Mock revenue data
const mockRevenueData = [
  { month: "Jan", amount: 12450 },
  { month: "Feb", amount: 13200 },
  { month: "Mar", amount: 15800 },
  { month: "Apr", amount: 14600 },
  { month: "May", amount: 16200 },
  { month: "Jun", amount: 17500 },
]

// API response types
interface ApiOpeningHour {
  dayOfWeek: number
  isClosed: boolean
  openTime: string
  closeTime: string
}

interface ApiSeatType {
  availableSeats: number
}

interface ApiLibraryData extends Omit<Library, 'openingHours' > {
  openingHours?: ApiOpeningHour[]
  seatTypes?: ApiSeatType[]
}

// Transform backend API response to frontend Library type
const transformApiResponse = (apiData: ApiLibraryData): Library => {
  // Transform opening hours from array to object format
  const openingHours: Library['openingHours'] = {
    sunday: { open: "closed", close: "closed" },
    monday: { open: "closed", close: "closed" },
    tuesday: { open: "closed", close: "closed" },
    wednesday: { open: "closed", close: "closed" },
    thursday: { open: "closed", close: "closed" },
    friday: { open: "closed", close: "closed" },
    saturday: { open: "closed", close: "closed" },
  }

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const

  if (apiData.openingHours && Array.isArray(apiData.openingHours)) {
    apiData.openingHours.forEach((hour: ApiOpeningHour) => {
      const dayName = dayNames[hour.dayOfWeek]
      if (dayName) {
        openingHours[dayName] = {
          open: hour.isClosed ? "closed" : hour.openTime,
          close: hour.isClosed ? "closed" : hour.closeTime,
        }
      }
    })
  }

  // Transform amenities to expected format
  const amenities: LibraryAmenity[] = []
  if (apiData.amenities && Array.isArray(apiData.amenities)) {
    apiData.amenities.forEach((amenity: string) => {
      const mapped = amenityMap[amenity]
      if (mapped) {
        amenities.push(mapped.key)
      }
    })
  }

  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description || "",
    address: apiData.address,
    city: apiData.city,
    state: apiData.state,
    country: apiData.country,
    postalCode: apiData.postalCode,
    email: apiData.email,
    phone: apiData.phone,
    images: apiData.images || [],
    rating: apiData.rating || 0,
    reviewCount: apiData.reviewCount || 0,
    amenities,
    openingHours,
    membershipPlans: apiData.membershipPlans || [],
    totalSeats: apiData.totalSeats || 0,
    availableSeats: apiData.availableSeats || apiData.seatTypes?.reduce((acc: number, seatType: ApiSeatType) => acc + (seatType.availableSeats || 0), 0) || 0,
    admin: apiData.admin,
    additinalInformation: apiData.additinalInformation,
    AdminBio: apiData.AdminBio,
    AdminCompleteAddress: apiData.AdminCompleteAddress,
    AdminPhone: apiData.AdminPhone,
    AdminGovernmentId: apiData.AdminGovernmentId,
    AdminPhoto: apiData.AdminPhoto,
    createdAt: apiData.createdAt,
  }
}

export default function LibraryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [library, setLibrary] = useState<Library | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true)
      try {
        if (params?.id) {
          const response = await fetch(`/api/libraries/${params.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          })

          if (!response.ok) {
            let errMsg = "Failed to fetch library details"
            try {
              const err = await response.json()
              errMsg = err?.message ?? errMsg
            } catch (_) {
              console.error("Error parsing error response:", _)
            }
            toast.error(errMsg)
            setLibrary(null)
            return
          }

          const result = await response.json()
          const transformedLibrary = transformApiResponse(result.data)
          setLibrary(transformedLibrary)
        }
      } catch (error) {
        console.error("Error fetching library:", error)
        toast.error("Network error: Failed to fetch library details")
        setLibrary(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
  }, [params?.id])

  if (loading) {
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
        <div className="flex flex-col items-center gap-4">
          <Building2 className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Library not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{library.address}</span>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Library
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 aspect-video overflow-hidden rounded-xl">
            <Image
              src={library.images && library.images.length > 0 ? library.images[0] : "/placeholder.jpg"}
              alt={library.name}
              width={1200}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{library.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {library.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {amenityIcons[amenity]}
                        </div>
                        <span className="capitalize">{amenity.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  {library?.membershipPlans && library.membershipPlans.length > 0 ? (
                    <div className="space-y-4">
                      {library.membershipPlans.map((plan) => (
                        <div key={plan.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{plan.name}</h3>
                            <Badge variant="outline">₹{plan.price}/{plan.duration} days</Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Bookings per month:</span> {plan.allowedBookingsPerMonth}
                            </div>
                            <div>
                              <span className="font-medium">E-Library access:</span> {plan.eLibraryAccess ? 'Yes' : 'No'}
                            </div>
                          </div>
                          {plan.features && plan.features.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  • {feature}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mb-2" />
                      <p>No membership plans available</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Membership Plans
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMembershipData.map((data) => (
                      <div key={data.plan} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{data.plan}</h3>
                          <span>{data.total} members</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Active</span>
                              <span>{data.active}</span>
                            </div>
                            <Progress value={(data.active / data.total) * 100} className="h-2" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Expired</span>
                              <span>{data.expired}</span>
                            </div>
                            <Progress value={(data.expired / data.total) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Monthly revenue for the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {/* This would be a chart in a real implementation */}
                    <div className="flex h-full w-full items-end justify-between gap-2">
                      {mockRevenueData.map((data, i) => {
                        const height = (data.amount / 18000) * 100
                        return (
                          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                            <div className="w-full rounded-md bg-primary" style={{ height: `${height}%` }}></div>
                            <span className="mt-2 text-center text-xs text-muted-foreground">{data.month}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Seat Occupancy</CardTitle>
                    <CardDescription>Daily average occupancy rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-8 border-primary/20">
                        <span className="text-3xl font-bold">
                          {typeof library.totalSeats === "number" && typeof library.availableSeats === "number" && library.totalSeats > 0
                            ? Math.round(((library.totalSeats - library.availableSeats) / library.totalSeats) * 100)
                            : 0}%
                        </span>
                        <span className="text-sm text-muted-foreground">Occupied</span>
                      </div>
                      <div className="text-center">
                        <p>
                          {typeof library.totalSeats === "number" && typeof library.availableSeats === "number"
                            ? library.totalSeats - library.availableSeats
                            : 0} out of {typeof library.totalSeats === "number" ? library.totalSeats : 0} seats occupied
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Member Activity</CardTitle>
                    <CardDescription>Active members by time of day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Morning (8AM - 12PM)</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Afternoon (12PM - 5PM)</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Evening (5PM - 9PM)</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Seats</h3>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{library.availableSeats}</span>
                    <span className="text-xs text-muted-foreground">Available</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{library.totalSeats}</span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Rating</h3>
                <div className="mt-2 flex items-center gap-2">
                  {library.rating > 0 ? (
                    <>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">{library.rating.toFixed(1)}</span>
                        <span className="ml-1 text-yellow-500">★</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({library.reviewCount} reviews)</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">No ratings yet</span>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Email:</span>
                    <span>{library.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Phone:</span>
                    <span>{library.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Address:</span>
                    <span>{library.address}, {library.city}, {library.state}, {library.country} {library.postalCode}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Today's Hours */}
              <div className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {(() => {
                    // For OpeningHours type: { monday: { open, close }, ... }
                    const days: Array<keyof typeof library.openingHours> = [
                      "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
                    ];
                    const today = days[new Date().getDay()];
                    const todayHours = library.openingHours?.[today];
                    if (!todayHours) return "No data";
                    if (todayHours.open === "closed" && todayHours.close === "closed") return "Closed";
                    return `${todayHours.open === "closed" ? "Closed" : todayHours.open} - ${todayHours.close === "closed" ? "Closed" : todayHours.close}`;
                  })()}
                </span>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Admin</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={library.AdminPhoto || "/placeholder-user.jpg"}
                      alt="ADMIN"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{library.admin?.name || 'Not available'}</p>
                    <p className="text-sm text-muted-foreground">{library.admin?.email || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push(`/contact/libraries/${params.id}/members`)}>
                <UsersRound className="mr-2 h-4 w-4" />
                View Members
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/contact/libraries/${params.id}/bookings`)}>
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Library Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {library.images && library.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {library.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                      <Image
                        src={image || "/placeholder.jpg"}
                        alt={`${library.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mb-2" />
                  <p>No images available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Images
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
