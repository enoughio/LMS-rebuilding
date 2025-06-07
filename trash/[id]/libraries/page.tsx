"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, Search, Wifi, Coffee, Zap, VolumeX, Users, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider" 
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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

export default function LibrariesPage() {
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<LibraryAmenity[]>([])
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true)
      try {
        const filters = {
          search: searchQuery,
          amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
          rating: minRating > 0 ? minRating : undefined,
        }
        const data = await mockLibraryService.getLibraries(filters)
        setLibraries(data)
      } catch (error) {
        console.error("Error fetching libraries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLibraries()
  }, [searchQuery, selectedAmenities, minRating])

  const handleAmenityChange = (amenity: LibraryAmenity) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0])
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> */}

      <div className="container py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Libraries</h1>
            <p className="text-muted-foreground">Find and explore libraries in your area</p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search libraries by name or location..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Libraries</SheetTitle>
                  <SheetDescription>Refine your search with these filters</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Amenities</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {(Object.keys(amenityLabels) as LibraryAmenity[]).map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityChange(amenity)}
                          />
                          <label
                            htmlFor={`amenity-${amenity}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            {amenityIcons[amenity]}
                            {amenityLabels[amenity]}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Minimum Rating</h3>
                      <span className="text-sm font-medium">{minRating.toFixed(1)}</span>
                    </div>
                    <Slider
                      defaultValue={[0]}
                      value={[minRating]}
                      max={5}
                      step={0.1}
                      onValueChange={handleRatingChange}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAmenities([])
                        setMinRating(0)
                      }}
                    >
                      Reset
                    </Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video w-full bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : libraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No libraries found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {libraries.map((library) => (
                <Card key={library.id} className="overflow-hidden">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={library.images[0] || "/placeholder.svg"}
                      alt={library.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{library.name}</h3>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{library.rating.toFixed(1)}</span>
                          <span className="ml-1 text-yellow-500">★</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{library.description}</p>
                      <p className="text-sm text-muted-foreground">{library.address}</p>
                      <div className="flex flex-wrap gap-1 pt-2">
                        {library.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                            {amenityIcons[amenity]}
                            <span className="text-xs">{amenityLabels[amenity]}</span>
                          </Badge>
                        ))}
                        {library.amenities.length > 4 && (
                          <Badge variant="secondary">+{library.amenities.length - 4} more</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/libraries/${library.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        {/* <Footer /> */}
      </div>
    </div>
  )
}
