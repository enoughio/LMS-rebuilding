"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { mockLibraryService } from "@/lib/mock-api/library-service"
import type { Library, LibraryAmenity } from "@/types/library"

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
          const libraryData = await mockLibraryService.getLibrary(params.id as string)
          setLibrary(libraryData)
        }
      } catch (error) {
        console.error("Error fetching library:", error)
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
              src={library.images[0] || "/placeholder.svg"}
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
                        <span className="capitalize">{amenity.replace("_", " ")}</span>
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
                  <div className="space-y-4">
                    {library.membershipPlans.map((plan) => (
                      <div key={plan.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant="outline">₹{plan.price}/month</Badge>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
                          {Math.round((library.availableSeats / library.totalSeats) * 100)}%
                        </span>
                        <span className="text-sm text-muted-foreground">Occupied</span>
                      </div>
                      <div className="text-center">
                        <p>
                          {library.totalSeats - library.availableSeats} out of {library.totalSeats} seats occupied
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
                  <div className="flex items-center">
                    <span className="text-lg font-medium">{library.rating.toFixed(1)}</span>
                    <span className="ml-1 text-yellow-500">★</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({library.reviewCount} reviews)</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Email:</span>
                    <span>contact@{library.name.toLowerCase().replace(/\s+/g, "")}.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Phone:</span>
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Website:</span>
                    <span>{library.name.toLowerCase().replace(/\s+/g, "")}.com</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Today's Hours</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
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
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Admin</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Admin"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Alice Admin</p>
                    <p className="text-sm text-muted-foreground">admin@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <UsersRound className="mr-2 h-4 w-4" />
                View Members
              </Button>
              <Button variant="outline" size="sm">
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
              <div className="grid grid-cols-2 gap-2">
                {library.images.map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${library.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
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
