"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Coffee, Loader2, Monitor, Save, Users, VolumeX, Wifi, Zap } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/lib/context/AuthContext" 
import type { Library, LibraryAmenity, OpeningHours } from "@/types/library"

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

// Map amenity to icon
const amenityIcons: Record<string, React.ReactNode> = {
  "WiFi": <Wifi className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
  "Study Rooms": <Users className="h-4 w-4" />,
  "Cafeteria": <Coffee className="h-4 w-4" />,
  "Lockers": <Lock className="h-4 w-4" />,
  "Air Conditioning": <Zap className="h-4 w-4" />,
  "Quiet Zone": <VolumeX className="h-4 w-4" />,
  "Computer Lab": <Monitor className="h-4 w-4" />,
  "Security": <Shield className="h-4 w-4" />,
  "Group Study Area": <Users className="h-4 w-4" />,
  "Power Outlets": <Zap className="h-4 w-4" />,
  "Printing Services": <Printer className="h-4 w-4" />,
};

export default function LibraryProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [library, setLibrary] = useState<Library | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Library>>({})

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true)
      try {
        if(!user?.libraryId) {
          toast.error("No library found for this user")
          router.push("/")
          return
        }

        const response = await fetch(`/api/libraries/${user.libraryId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch library data")
        }
        const data  = await response.json()
        console.log("Library data fetched successfully:", data)
        const libraryData: Library = data.data || data
        
        // Convert openingHours array to object format for frontend
        const convertOpeningHours = (
          hours: OpeningHours | Array<{ dayOfWeek: number; openTime: string; closeTime: string; isClosed?: boolean }>
        ) => {
          if (Array.isArray(hours)) {
            const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const openingHoursObj: OpeningHours = {} as OpeningHours;

            hours.forEach((hour: { dayOfWeek: number; openTime: string; closeTime: string; isClosed?: boolean }) => {
              const isClosed = hour.isClosed ?? false;
              const dayName = dayNames[hour.dayOfWeek];
              openingHoursObj[dayName as keyof OpeningHours] = {
                open: isClosed ? "" : hour.openTime,
                close: isClosed ? "" : hour.closeTime
              };
            });

            return openingHoursObj;
          }
          return hours || {
            monday: { open: "", close: "" },
            tuesday: { open: "", close: "" },
            wednesday: { open: "", close: "" },
            thursday: { open: "", close: "" },
            friday: { open: "", close: "" },
            saturday: { open: "", close: "" },
            sunday: { open: "", close: "" },
          };
        };

        // Also normalize amenities to match frontend expectations
        const normalizeAmenities = (amenities: string[] | undefined) => {
          if (!amenities || !Array.isArray(amenities)) return [];
          
          // Map backend amenities to frontend LibraryAmenity enum values
          const amenityMap: Record<string, LibraryAmenity> = {
            "WiFi": "wifi",
            "Wi-Fi": "wifi",
            "wifi": "wifi",
            "Parking": "power_outlets", // Map Parking to power_outlets as closest match
            "Power Outlets": "power_outlets",
            "power_outlets": "power_outlets",
            "Study Rooms": "meeting_rooms",
            "meeting_rooms": "meeting_rooms",
            "Cafeteria": "cafe",
            "cafe": "cafe",
            "Lockers": "computers", // Map Lockers to computers as closest match
            "computers": "computers",
            "Air Conditioning": "ac",
            "ac": "ac",
            "Quiet Zones": "quiet_zones",
            "quiet_zones": "quiet_zones"
          };
          
          return amenities
            .map((amenity: string) => amenityMap[amenity])
            .filter((mappedAmenity): mappedAmenity is LibraryAmenity => Boolean(mappedAmenity));
        };

        setLibrary(libraryData)
        setFormData({
          name: libraryData.name,
          description: libraryData.description,
          address: libraryData.address,
          city: libraryData.city,
          state: libraryData.state,
          country: libraryData.country,
          postalCode: libraryData.postalCode,
          email: libraryData.email,
          phone: libraryData.phone,
          amenities: normalizeAmenities(libraryData.amenities),
          openingHours: convertOpeningHours(libraryData.openingHours ?? []),
          images: libraryData.images || [],
        })
        toast.success("Library profile loaded successfully")

      } catch (error) {
        console.error("Error fetching library:", error)
        toast.error(error instanceof Error ? error.message : "Failed to load library data")
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => {
      const currentAmenities = prev.amenities || []
      return {
        ...prev,
        amenities: checked 
          ? [...currentAmenities, amenity] 
          : currentAmenities.filter((a) => a !== amenity),
      }
    })
  }
  
  const handleOpeningHoursChange = (day: string, field: "open" | "close", value: string) => {
    setFormData((prev) => {
      const currentOpeningHours = (typeof prev.openingHours === 'object' && !Array.isArray(prev.openingHours)) 
        ? prev.openingHours as OpeningHours 
        : {} as OpeningHours;
      
      return {
        ...prev,
        openingHours: {
          ...currentOpeningHours,
          [day]: {
            ...currentOpeningHours[day as keyof OpeningHours],
            [field]: value,
          },
        } as OpeningHours,
      };
    });
  }

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)

    try {
      // Convert amenities back to backend format
      const convertAmenitiesToBackend = (amenities: LibraryAmenity[] = []) => {
        const backendAmenityMap: Record<LibraryAmenity, string> = {
          "wifi": "WiFi",
          "power_outlets": "Power Outlets",
          "meeting_rooms": "Study Rooms",
          "cafe": "Cafeteria",
          "computers": "Lockers",
          "ac": "Air Conditioning",
          "quiet_zones": "Quiet Zones"
        };
        
        return amenities.map(amenity => backendAmenityMap[amenity]).filter(Boolean);
      };

      // Convert opening hours object back to array format for backend
      const convertOpeningHoursToArray = (hours: Record<string, unknown>) => {
        if (!hours || typeof hours !== 'object') return [];
        
        const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const openingHoursArray: Array<Record<string, unknown>> = [];
        
        dayNames.forEach((dayName, index) => {
          const dayHours = hours[dayName];
          if (dayHours && typeof dayHours === 'object' && dayHours !== null) {
            const typedDayHours = dayHours as { open?: string; close?: string };
            openingHoursArray.push({
              dayOfWeek: index,
              openTime: typedDayHours.open || "00:00",
              closeTime: typedDayHours.close || "00:00",
              isClosed: !typedDayHours.open || !typedDayHours.close
            });
          }
        });
        
        return openingHoursArray;
      };

      // Prepare data for backend
      const saveData = {
        ...formData,
        amenities: convertAmenitiesToBackend(
          (formData.amenities || []).filter((a): a is LibraryAmenity =>
            typeof a === "string" && Object.keys(amenityLabels).includes(a)
          )
        ),
        openingHours: convertOpeningHoursToArray(
          (formData.openingHours && typeof formData.openingHours === 'object' && !Array.isArray(formData.openingHours))
            ? formData.openingHours as Record<string, unknown>
            : {}
        )
      };

      const response = await fetch(`/api/libraries/${user.libraryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update library")
      }

      const updatedData = await response.json()
      const updatedLibrary = updatedData.data || updatedData
      
      // Convert the response back to frontend format
      const convertOpeningHours = (hours: unknown) => {
        if (Array.isArray(hours)) {
          const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
          const openingHoursObj: Record<string, unknown> = {};
          
          hours.forEach((hour: Record<string, unknown>) => {
            const dayName = dayNames[hour.dayOfWeek as number];
            openingHoursObj[dayName] = {
              open: hour.isClosed ? "" : hour.openTime,
              close: hour.isClosed ? "" : hour.closeTime
            };
          });
          
          return openingHoursObj;
        }
        return hours;
      };

      // Normalize amenities again
      const normalizeAmenities = (amenities: unknown) => {
        if (!amenities || !Array.isArray(amenities)) return [];
        
        const amenityMap: Record<string, LibraryAmenity> = {
          "WiFi": "wifi",
          "Wi-Fi": "wifi",
          "wifi": "wifi",
          "Parking": "power_outlets",
          "Power Outlets": "power_outlets",
          "power_outlets": "power_outlets",
          "Study Rooms": "meeting_rooms",
          "meeting_rooms": "meeting_rooms",
          "Cafeteria": "cafe",
          "cafe": "cafe",
          "Lockers": "computers",
          "computers": "computers",
          "Air Conditioning": "ac",
          "ac": "ac",
          "Quiet Zones": "quiet_zones",
          "quiet_zones": "quiet_zones"
        };
        
        return amenities
          .map((amenity: string) => amenityMap[amenity])
          .filter((mappedAmenity): mappedAmenity is LibraryAmenity => Boolean(mappedAmenity));
      };

      setLibrary(updatedLibrary)
      setFormData({
        ...updatedLibrary,
        amenities: normalizeAmenities(updatedLibrary.amenities),
        openingHours: convertOpeningHours(updatedLibrary.openingHours)
      })

      toast.success("Library profile updated successfully")

    } catch (error) {
      console.error("Error updating library:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update library profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-w-[70vw] ">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading library profile...</p>
        </div>
      </div>
    )
  }

  if (!library) {
    return (
      <div className="flex h-full w-full items-center justify-center min-w-[70vw]">
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium">Library not found</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-0 max-w-none px-0 min-w-[70vw] pb-20">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Library Profile</h1>
        <p className="text-muted-foreground">Manage your library&apos;s information and settings</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="hours">Opening Hours</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your library&apos;s basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0">
              <div className="space-y-2">
                <Label htmlFor="name">Library Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter library name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Describe your library"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter library address"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                    placeholder="Enter country"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode || ""}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    placeholder="Enter library email"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Enter library phone"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    name="totalSeats"
                    type="number"
                    value={library?.totalSeats || ""}
                    disabled
                    className="w-full bg-gray-50"
                    title="Total seats cannot be edited from this page"
                  />
                  <p className="text-xs text-muted-foreground">This field is managed by seat configuration</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableSeats">Available Seats</Label>
                  <Input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    value={library?.totalSeats ? library.totalSeats - 0 : 0}
                    disabled
                    className="w-full bg-gray-50"
                    title="Available seats are calculated automatically"
                  />
                  <p className="text-xs text-muted-foreground">This field is calculated automatically based on bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="mt-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select the amenities available at your library</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {Object.keys(amenityLabels).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={(formData.amenities || []).includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenityIcons[amenity] || null}
                      {amenityLabels[amenity] || amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Opening Hours</CardTitle>
              <CardDescription>Set your library&apos;s operating hours</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-6">
                {formData.openingHours && typeof formData.openingHours === 'object' && !Array.isArray(formData.openingHours) && 
                  Object.keys(formData.openingHours).map((day) => {
                    const dayHours = (formData.openingHours as Record<string, unknown>)?.[day] as Record<string, string> || { open: "", close: "" };
                    return (
                      <div key={day} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`${day}-open`} className="capitalize">
                            {day} Opening Time
                          </Label>
                          <Input
                            id={`${day}-open`}
                            type="time"
                            value={dayHours.open || ""}
                            onChange={(e) => handleOpeningHoursChange(day, "open", e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${day}-close`} className="capitalize">
                            {day} Closing Time
                          </Label>
                          <Input
                            id={`${day}-close`}
                            type="time"
                            value={dayHours.close || ""}
                            onChange={(e) => handleOpeningHoursChange(day, "close", e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-0">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Library Images</CardTitle>
              <CardDescription>Upload and manage images of your library</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {(library?.images || []).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Library image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: (prev.images || []).filter((_, i) => i !== index),
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <p className="text-sm font-medium">Add Image</p>
                    <p className="text-xs text-muted-foreground">Upload a new image of your library</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={saving} size="lg" className="bg-gray-600 text-white" >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <div className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
