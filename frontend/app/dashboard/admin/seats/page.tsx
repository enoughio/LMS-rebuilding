"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Armchair, Loader2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { useToast } from "@/components/ui/use-toast"
import type { Seat, SeatType } from "@/types/library"
import toast from "react-hot-toast"
import { useAuth } from "@/lib/context/AuthContext"

export default function SeatsPage() {
  // const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [seats, setSeats] = useState<Seat[]>([])
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    seatTypeId: "",
    positionX: 1,
    positionY: 1,
  })

  useEffect(() => {

    if (authLoading) return // Wait for auth context to load
    
    // Fetch seats and seat types from API
    if(!user?.libraryId ) {
      toast.error("You dont have a library associated with your account. Please contact support.")
      return
    }    const fetchData = async () => {
      if (!user?.libraryId) {
        toast.error("You must be associated with a library to manage seats")
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Fetch seats and seat types separately
        const seatsResponse = await fetch(`/api/seats/library/${user.libraryId}`)
        const seatTypesResponse = await fetch(`/api/seats/seattype/libraries/${user.libraryId}`)
        
        // Check if both requests were successful
        if (!seatsResponse.ok) {
          const errorData = await seatsResponse.json()
          throw new Error(errorData.message || "Failed to fetch seats data")
        }
        
        if (!seatTypesResponse.ok) {
          const errorData = await seatTypesResponse.json()
          throw new Error(errorData.message || "Failed to fetch seat types data")
        }
        
        // Parse the responses
        const seatsResult = await seatsResponse.json()
        const seatTypesResult = await seatTypesResponse.json()
        
        // Handle seats data
        if (seatsResult.success && seatsResult.data) {
          console.log("Fetched seats data:", seatsResult)
          const seatsData = seatsResult.data.seats || []
          setSeats(seatsData)
        } else {
          throw new Error("Invalid seats response structure from server")
        }
        
        // Handle seat types data
        if (seatTypesResult.success && seatTypesResult.data) {
          console.log("Fetched seat types data:", seatTypesResult)
          const seatTypesData = seatTypesResult.data || []
          setSeatTypes(seatTypesData)
          
          // Check if seat types are available for creating new seats
          if (seatTypesData.length === 0) {
            toast.error("No seat types found. Please create seat types first before adding seats.")
          }
        } else {
          throw new Error("Invalid seat types response structure from server")
        }
    
      } catch (error) {
        console.error("Error fetching data:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch data from server"
        toast.error(errorMessage)
        
        // Set empty arrays instead of mock data
        setSeats([])
        setSeatTypes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authLoading, user?.libraryId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "positionX" || name === "positionY" ? Number(value) : value,
    }))
  }

  const handleSeatTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, seatTypeId: value }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.seatTypeId) {
      toast.error("Please fill in all required fields")
      return
    }

    const selectedSeatType = seatTypes.find((st) => st.id === formData.seatTypeId)
    setSubmitting(true)

    try {
      if (editingSeat) {
        // Update existing seat
        const updatedSeatData = {
          name: formData.name,
          seatTypeId: formData.seatTypeId,
          position: { x: formData.positionX, y: formData.positionY },
        }

        const response = await fetch(`/api/seats/${editingSeat.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSeatData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to update seat")
        }

        await response.json()
          // Update state with the edited seat
        const selectedSeatTypeForUpdate = seatTypes.find((st) => st.id === formData.seatTypeId)
        const updatedSeat: Seat = {
          ...editingSeat,
          ...updatedSeatData,
          seatType: selectedSeatTypeForUpdate, // Include the nested seatType object
          updatedAt: new Date().toISOString(),
        }
        setSeats((prev) => prev.map((seat) => (seat.id === editingSeat.id ? updatedSeat : seat)))

        toast.success(`Seat "${formData.name}" has been updated successfully.`)
      } else {
        // Add new seat
        
        if (!user?.libraryId) {
          toast.error("You must be associated with a library to add seats")
          return
        }

        if (!selectedSeatType) {
          toast.error("Selected seat type not found")
          return
        }

        const newSeatData = {
          name: formData.name,
          seatTypeId: formData.seatTypeId,
          position: { x: formData.positionX, y: formData.positionY },
        }

        const response = await fetch(`/api/seats/library/${user.libraryId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSeatData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to add new seat")
        }

        const result = await response.json()
          // Add the new seat with the ID returned from the server
        const newSeat: Seat = {
          id: result.data.id || `seat-${Date.now()}`,
          name: formData.name,
          seatTypeId: formData.seatTypeId,
          seatType: selectedSeatType, // Include the nested seatType object
          libraryId: user.libraryId,
          isAvailable: true,
          position: { x: formData.positionX, y: formData.positionY },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setSeats((prev) => [...prev, newSeat])
        toast.success(`Seat "${formData.name}" has been added successfully.`)
      }

      // Reset form
      setFormData({
        name: "",
        seatTypeId: "",
        positionX: 1,
        positionY: 1,
      })
      setEditingSeat(null)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error submitting seat:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (seat: Seat) => {
    setEditingSeat(seat)
    setFormData({
      name: seat.name,
      seatTypeId: seat.seatTypeId,
      positionX: seat.position?.x || 1,
      positionY: seat.position?.y || 1,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (seatId: string) => {
    try {
      const response = await fetch(`/api/seats/${seatId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete seat")
      }
      
      setSeats((prev) => prev.filter((seat) => seat.id !== seatId))
      toast.success("The seat has been deleted successfully.")
    } catch (error) {
      console.error("Error deleting seat:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete seat. Please try again later."
      toast.error(errorMessage)
    }
  }


  const toggleAvailability = async (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat) return

    try {
      // Update local state optimistically
      const updatedSeat = { ...seat, isAvailable: !seat.isAvailable, updatedAt: new Date().toISOString() }
      setSeats((prev) => prev.map((s) => (s.id === seatId ? updatedSeat : s)))

      // You could also make an API call here to persist the change
      // const response = await fetch(`/api/seats/${seatId}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ isAvailable: !seat.isAvailable }),
      // })

      toast.success(`Seat "${seat.name}" is now ${!seat.isAvailable ? "available" : "unavailable"}.`)
    } catch (error) {
      console.error("Error updating seat availability:", error)
      toast.error("Failed to update seat availability")
      // Revert the optimistic update
      setSeats((prev) => prev.map((s) => (s.id === seatId ? seat : s)))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      seatTypeId: "",
      positionX: 1,
      positionY: 1,
    })
    setEditingSeat(null)
  }
  const getSeatsByType = (seatTypeId: string) => {
    return seats.filter((seat) => seat.seatType?.id === seatTypeId || seat.seatTypeId === seatTypeId)
  }

  return (
    <div className="space-y-6 min-w-[70vw] pb-30">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Seats Management</h1>
        <p className="text-muted-foreground">Manage individual seats and their availability</p>
      </div>

      <div className="flex justify-end">
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button disabled={seatTypes.length === 0} title={seatTypes.length === 0 ? "Please create seat types first" : ""}>
              <Plus className="mr-2 h-4 w-4" />
              Add Seat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-amber-50 ">
            <DialogHeader>
              <DialogTitle>{editingSeat ? "Edit Seat" : "Add New Seat"}</DialogTitle>
              <DialogDescription>
                {editingSeat ? "Update the seat details" : "Create a new seat for your library"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seat Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. A1, B2, Q1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seatTypeId">Seat Type *</Label>
                  <Select value={formData.seatTypeId} onValueChange={handleSeatTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={seatTypes.length === 0 ? "No seat types available" : "Select seat type"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {seatTypes.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No seat types available. Please create seat types first.
                        </div>
                      ) : (
                        seatTypes.map((seatType) => (
                          <SelectItem key={seatType.id} value={seatType.id}>
                            <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seatType.color as string }} />
                              {seatType.name} (₹{seatType.pricePerHour}/hr)
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="positionX">Position X</Label>
                  <Input
                    id="positionX"
                    name="positionX"
                    type="number"
                    min="1"
                    value={formData.positionX}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionY">Position Y</Label>
                  <Input
                    id="positionY"
                    name="positionY"
                    type="number"
                    min="1"
                    value={formData.positionY}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingSeat ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{editingSeat ? "Update" : "Add"} Seat</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : seatTypes.length > 0 ? (
        <div className="space-y-6">
          {seatTypes.map((seatType) => {
            const seatsOfType = getSeatsByType(seatType.id)

            return (
              <Card key={seatType.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seatType.color as string }} />
                      <CardTitle>{seatType.name}</CardTitle>
                      <Badge variant="outline">{seatsOfType.length} seats</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">₹{seatType.pricePerHour}/hour</div>
                  </div>
                  <CardDescription>{seatType.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {seatsOfType.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Armchair className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">No seats of this type</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {seatsOfType.map((seat) => (
                        <div key={seat.id} className="relative rounded-lg border p-4 min-w-fit min-h-fit">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Armchair className="h-4 w-4" />
                              <span className="font-medium">{seat.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(seat)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDelete(seat.id)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>
                                Position: {seat.position?.x || 0}, {seat.position?.y || 0}
                              </span>
                            </div>

                            <div className="flex items-center justify-between flex-col">
                              <Badge variant={seat.isAvailable ? "default" : "destructive"}>
                                {seat.isAvailable ? "Available" : "Occupied"}
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => toggleAvailability(seat.id)}>
                                {seat.isAvailable ? "Mark Occupied" : "Mark Available"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      {!loading && seatTypes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Armchair className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No seat types found</h3>
          <p className="text-muted-foreground">Please create seat types first before adding seats</p>
          <p className="text-sm text-muted-foreground mt-2">Go to Seat Types management to create seat types</p>
        </div>
      )}

      {!loading && seatTypes.length > 0 && seats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Armchair className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No seats found</h3>
          <p className="text-muted-foreground">Create your first seat to get started</p>
        </div>
      )}
    </div>
  )
}
