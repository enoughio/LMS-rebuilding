"use client"

import type React from "react"
import toast from "react-hot-toast"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import type { LibraryAmenity } from "@/types/library"

export type AddLibraryFormProps = {
  onSubmit: (data: any) => void
  onCancel: () => void
}

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export function AddLibraryForm({ onSubmit, onCancel }: AddLibraryFormProps) {
  // const { toast } = 
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    description: "",
    address: "",

    // Contact info
    ownerName: "",
    ownerEmail: "",
    phone: "",
    website: "",

    // Amenities
    amenities: [] as LibraryAmenity[],

    // Opening hours
    openingHours: Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, { open: "09:00", close: "18:00" }])),

    // Seats
    totalSeats: "50",

    // Membership plans
    membershipPlans: [
      {
        name: "Basic",
        price: "999",
        duration: "30",
        features: ["Access to library", "5 seat bookings per month"],
        allowedBookingsPerMonth: "5",
        eLibraryAccess: true,
      },
    ],
  })

  const amenityOptions: { value: LibraryAmenity; label: string }[] = [
    { value: "wifi", label: "WiFi" },
    { value: "ac", label: "Air Conditioning" },
    { value: "cafe", label: "Café" },
    { value: "power_outlets", label: "Power Outlets" },
    { value: "quiet_zones", label: "Quiet Zones" },
    { value: "meeting_rooms", label: "Meeting Rooms" },
    { value: "computers", label: "Computers" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (day: string, type: "open" | "close", value: string) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [type]: value,
        },
      },
    }))
  }

  const handleAmenityChange = (amenity: LibraryAmenity, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleFeatureChange = (index: number, featureIndex: number, value: string) => {
    const newPlans = [...formData.membershipPlans]
    newPlans[index].features[featureIndex] = value

    setFormData((prev) => ({
      ...prev,
      membershipPlans: newPlans,
    }))
  }

  const handleAddFeature = (planIndex: number) => {
    const newPlans = [...formData.membershipPlans]
    newPlans[planIndex].features.push("")

    setFormData((prev) => ({
      ...prev,
      membershipPlans: newPlans,
    }))
  }

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...formData.membershipPlans]
    newPlans[planIndex].features.splice(featureIndex, 1)

    setFormData((prev) => ({
      ...prev,
      membershipPlans: newPlans,
    }))
  }

  const handlePlanChange = (index: number, field: string, value: string | boolean) => {
    const newPlans = [...formData.membershipPlans]
    newPlans[index] = {
      ...newPlans[index],
      [field]: value,
    }

    setFormData((prev) => ({
      ...prev,
      membershipPlans: newPlans,
    }))
  }

  const handleAddPlan = () => {
    setFormData((prev) => ({
      ...prev,
      membershipPlans: [
        ...prev.membershipPlans,
        {
          name: "",
          price: "",
          duration: "30",
          features: [""],
          allowedBookingsPerMonth: "0",
          eLibraryAccess: false,
        },
      ],
    }))
  }

  const handleRemovePlan = (index: number) => {
    const newPlans = [...formData.membershipPlans]
    newPlans.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      membershipPlans: newPlans,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.address || !formData.ownerEmail) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.amenities.length === 0) {
      toast.error("Please select at least one amenity")
      return
    }

    if (formData.membershipPlans.length === 0) {
      toast.error("Please add at least one membership plan")
      return
    }

    // Process the data into the correct format
    const processedData = {
      ...formData,
      totalSeats: Number.parseInt(formData.totalSeats),
      availableSeats: Number.parseInt(formData.totalSeats), // Initially all seats are available
      membershipPlans: formData.membershipPlans.map((plan) => ({
        ...plan,
        price: Number.parseInt(plan.price),
        duration: Number.parseInt(plan.duration),
        allowedBookingsPerMonth: Number.parseInt(plan.allowedBookingsPerMonth),
      })),
      images: ["/placeholder.svg?height=400&width=600"],
      rating: 0,
      reviewCount: 0,
    }

    onSubmit(processedData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Library Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter library name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter library description"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
              required
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Enter owner name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email *</Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleInputChange}
                placeholder="Enter owner email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Enter website URL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSeats">Total Seats *</Label>
            <Input
              id="totalSeats"
              name="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={handleInputChange}
              placeholder="Enter total seats"
              required
              min="1"
            />
          </div>
        </TabsContent>

        <TabsContent value="amenities" className="py-4">
          <div className="space-y-4">
            <Label>Amenities *</Label>
            <div className="grid grid-cols-2 gap-4">
              {amenityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${option.value}`}
                    checked={formData.amenities.includes(option.value)}
                    onCheckedChange={(checked) => handleAmenityChange(option.value, checked as boolean)}
                  />
                  <Label htmlFor={`amenity-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4 py-4">
          <Label>Opening Hours *</Label>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="grid grid-cols-5 items-center gap-4">
                <Label className="col-span-1 capitalize">{day}</Label>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day}-open`} className="w-12">
                      Open:
                    </Label>
                    <Input
                      id={`${day}-open`}
                      type="time"
                      value={formData.openingHours[day].open}
                      onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day}-close`} className="w-12">
                      Close:
                    </Label>
                    <Input
                      id={`${day}-close`}
                      type="time"
                      value={formData.openingHours[day].close}
                      onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label>Membership Plans *</Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddPlan}>
              Add Plan
            </Button>
          </div>

          <div className="space-y-6">
            {formData.membershipPlans.map((plan, planIndex) => (
              <Card key={planIndex} className="overflow-hidden">
                <CardContent className="p-4 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Plan {planIndex + 1}</h3>
                    {formData.membershipPlans.length > 1 && (
                      <Button type="button" variant="destructive" size="sm" onClick={() => handleRemovePlan(planIndex)}>
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`plan-${planIndex}-name`}>Plan Name *</Label>
                        <Input
                          id={`plan-${planIndex}-name`}
                          value={plan.name}
                          onChange={(e) => handlePlanChange(planIndex, "name", e.target.value)}
                          placeholder="e.g. Basic, Premium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`plan-${planIndex}-price`}>Price (₹) *</Label>
                        <Input
                          id={`plan-${planIndex}-price`}
                          type="number"
                          value={plan.price}
                          onChange={(e) => handlePlanChange(planIndex, "price", e.target.value)}
                          placeholder="Enter price"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`plan-${planIndex}-duration`}>Duration (days) *</Label>
                        <Input
                          id={`plan-${planIndex}-duration`}
                          type="number"
                          value={plan.duration}
                          onChange={(e) => handlePlanChange(planIndex, "duration", e.target.value)}
                          placeholder="Enter duration in days"
                          required
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`plan-${planIndex}-bookings`}>Allowed Bookings/Month *</Label>
                        <Input
                          id={`plan-${planIndex}-bookings`}
                          type="number"
                          value={plan.allowedBookingsPerMonth}
                          onChange={(e) => handlePlanChange(planIndex, "allowedBookingsPerMonth", e.target.value)}
                          placeholder="Enter allowed bookings"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`plan-${planIndex}-elibrary`}
                        checked={plan.eLibraryAccess}
                        onCheckedChange={(checked) => handlePlanChange(planIndex, "eLibraryAccess", checked)}
                      />
                      <Label htmlFor={`plan-${planIndex}-elibrary`}>E-Library Access</Label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Features *</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddFeature(planIndex)}>
                          Add Feature
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                              placeholder="Enter feature"
                              required
                            />
                            {plan.features.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="px-2"
                                onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Library</Button>
      </div>
    </form>
  )
}
