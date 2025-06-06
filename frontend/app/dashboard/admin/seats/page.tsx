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
import { useToast } from "@/components/ui/use-toast"
import type { Seat, SeatType } from "@/types/library"

// Mock seat types data
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
]

// Mock seats data
const mockSeats: Seat[] = [
  {
    id: "seat-1",
    name: "A1",
    seatTypeId: "st-1",
    libraryId: "lib-1",
    isAvailable: true,
    position: { x: 1, y: 1 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "seat-2",
    name: "A2",
    seatTypeId: "st-1",
    libraryId: "lib-1",
    isAvailable: false,
    position: { x: 2, y: 1 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "seat-3",
    name: "B1",
    seatTypeId: "st-2",
    libraryId: "lib-1",
    isAvailable: true,
    position: { x: 1, y: 2 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "seat-4",
    name: "B2",
    seatTypeId: "st-2",
    libraryId: "lib-1",
    isAvailable: true,
    position: { x: 2, y: 2 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "seat-5",
    name: "Q1",
    seatTypeId: "st-3",
    libraryId: "lib-1",
    isAvailable: true,
    position: { x: 1, y: 3 },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export default function SeatsPage() {
  const { toast } = useToast()
  const [seats, setSeats] = useState<Seat[]>([])
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    seatTypeId: "",
    positionX: 1,
    positionY: 1,
  })

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true)
      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setSeats(
          mockSeats.map((seat) => ({
            ...seat,
            seatType: mockSeatTypes.find((st) => st.id === seat.seatTypeId),
          })),
        )
        setSeatTypes(mockSeatTypes)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  const handleSubmit = () => {
    if (!formData.name || !formData.seatTypeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const selectedSeatType = seatTypes.find((st) => st.id === formData.seatTypeId)

    if (editingSeat) {
      // Update existing seat
      const updatedSeat: Seat = {
        ...editingSeat,
        name: formData.name,
        seatTypeId: formData.seatTypeId,
        seatType: selectedSeatType,
        position: { x: formData.positionX, y: formData.positionY },
        updatedAt: new Date().toISOString(),
      }

      setSeats((prev) => prev.map((seat) => (seat.id === editingSeat.id ? updatedSeat : seat)))

      toast({
        title: "Seat Updated",
        description: `Seat "${formData.name}" has been updated successfully.`,
      })
    } else {
      // Add new seat
      const newSeat: Seat = {
        id: `seat-${Date.now()}`,
        name: formData.name,
        seatTypeId: formData.seatTypeId,
        seatType: selectedSeatType,
        libraryId: "lib-1",
        isAvailable: true,
        position: { x: formData.positionX, y: formData.positionY },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setSeats((prev) => [...prev, newSeat])

      toast({
        title: "Seat Added",
        description: `Seat "${formData.name}" has been added successfully.`,
      })
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
  }

  const handleEdit = (seat: Seat) => {
    setEditingSeat(seat)
    setFormData({
      name: seat.name,
      seatTypeId: seat.seatTypeId,
      positionX: seat.position.x,
      positionY: seat.position.y,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (seatId: string) => {
    setSeats((prev) => prev.filter((seat) => seat.id !== seatId))
    toast({
      title: "Seat Deleted",
      description: "The seat has been deleted successfully.",
    })
  }

  const toggleAvailability = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId ? { ...seat, isAvailable: !seat.isAvailable, updatedAt: new Date().toISOString() } : seat,
      ),
    )

    const seat = seats.find((s) => s.id === seatId)
    toast({
      title: "Seat Status Updated",
      description: `Seat "${seat?.name}" is now ${seat?.isAvailable ? "unavailable" : "available"}.`,
    })
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
    return seats.filter((seat) => seat.seatTypeId === seatTypeId)
  }

  return (
    <div className="space-y-6">
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Seat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
                      <SelectValue placeholder="Select seat type" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatTypes.map((seatType) => (
                        <SelectItem key={seatType.id} value={seatType.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seatType.color }} />
                            {seatType.name} (₹{seatType.pricePerHour}/hr)
                          </div>
                        </SelectItem>
                      ))}
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
              <Button onClick={handleSubmit}>{editingSeat ? "Update" : "Add"} Seat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {seatTypes.map((seatType) => {
            const seatsOfType = getSeatsByType(seatType.id)

            return (
              <Card key={seatType.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: seatType.color }} />
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
                        <div key={seat.id} className="relative rounded-lg border p-4">
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
                                Position: {seat.position.x}, {seat.position.y}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
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
      )}

      {!loading && seats.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Armchair className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No seats found</h3>
          <p className="text-muted-foreground">Create your first seat to get started</p>
        </div>
      )}
    </div>
  )
}
