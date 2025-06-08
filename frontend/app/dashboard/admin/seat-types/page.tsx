"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Armchair, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SeatType } from "@/types/library";
import { useAuth } from "@/lib/context/AuthContext";



export default function SeatTypesPage() {
  const { user, isLoading: authLoading } = useAuth(); 
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSeatType, setEditingSeatType] = useState<SeatType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerHour: 0,
    amenities: "",
    color: "#3B82F6",
  });

  // Draft saving functionality
  const DRAFT_KEY = 'seat-type-form-draft';
  
  const saveDraft = useCallback((data: typeof formData, isEditing: boolean, editId?: string) => {
    const draft = {
      formData: data,
      isEditing,
      editId,
      timestamp: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, []);

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        // Only load draft if it's less than 24 hours old
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          return draft;
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  // Auto-save draft whenever form data changes
  useEffect(() => {
    if (isAddDialogOpen && (formData.name || formData.description || formData.pricePerHour > 0 || formData.amenities)) {
      saveDraft(formData, !!editingSeatType, editingSeatType?.id);
    }
  }, [formData, isAddDialogOpen, editingSeatType, saveDraft]);

  // Load draft when opening dialog
  useEffect(() => {
    if (isAddDialogOpen && !editingSeatType) {
      const draft = loadDraft();
      if (draft && !draft.isEditing) {
        setFormData(draft.formData);
        toast.success('Draft restored from previous session');
      }
    }
  }, [isAddDialogOpen, editingSeatType]);

  // Debug logging
  useEffect(() => {
    console.log("Auth loading:", authLoading);
    console.log("User:", user);
    console.log("User libraryId:", user?.libraryId);
  }, [authLoading, user]);

  useEffect(() => {
    const fetchSeatTypes = async () => {
      // Wait for auth loading to complete before checking user
      if (authLoading) {
        return;
      }

      if (!user || !user.libraryId) {
        console.error("No library ID found for user:", user);
        // if (user) {
        //   console.log("User object keys:", Object.keys(user));
        //   console.log("Library ID value:", user.libraryId);
        //   console.log("Library ID type:", typeof user.libraryId);
        // }
        toast.error("No library ID found for user. Please contact support.");
        setLoading(false);
        return;
      }

      // At this point, user and user.libraryId are guaranteed to exist
      const libraryId = user.libraryId;

      setLoading(true);
      try {
        console.log("Fetching seat types for library:", libraryId);
        const response = await fetch(`/api/seats/seattype/libraries/${libraryId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch seat types: ${response.status} ${response.statusText}`);
        }

        const seatTypeData = await response.json();
        if (!seatTypeData.success || !seatTypeData.data) {
          throw new Error("Invalid response structure from backend");
        }

        // Transform Prisma types to frontend types
        const transformedSeatTypes: SeatType[] = seatTypeData.data.map((seatType: Record<string, unknown>) => ({
          ...seatType,
          name: String(seatType.name),
          description: String(seatType.description || ""),
          color: String(seatType.color || "#3B82F6"),
          amenities: seatType.amenities || [],
          pricePerHour: seatType.pricePerHour || 0,
          createdAt: seatType.createdAt || new Date().toISOString(),
          updatedAt: seatType.updatedAt || new Date().toISOString(),
        }));

        setSeatTypes(transformedSeatTypes);
        toast.success(`${transformedSeatTypes.length} seat types loaded successfully.`);
      } catch (error) {
        console.error("Error fetching seat types:", error);
        toast.error("Failed to fetch seat types. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeatTypes();
  }, [user?.libraryId, authLoading, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pricePerHour" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || formData.pricePerHour <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user || !user.libraryId) {
      toast.error("User library information not available");
      return;
    }

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    if (editingSeatType) {
      // Update existing seat type
      const updatedSeatType: SeatType = {
        ...editingSeatType,
        name: formData.name,
        description: formData.description,
        pricePerHour: formData.pricePerHour,
        amenities: amenitiesArray,
        color: formData.color,
        updatedAt: new Date().toISOString(),
      };

      try {
        const response = await fetch(`/api/seats/seattype/${editingSeatType.id}`, {
          method: "PATCH", // Backend expects PATCH for updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Type: formData.name,
            description: formData.description,
            pricePerHour: formData.pricePerHour,
            amenities: amenitiesArray,
            color: formData.color,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update seat type");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to update seat type");
        }

        setSeatTypes((prev) =>
          prev.map((st) => (st.id === editingSeatType.id ? updatedSeatType : st))
        );

        toast.success(`"${formData.name}" has been updated successfully.`);
      } catch (error) {
        console.error("Error updating seat type:", error);
        toast.error(error instanceof Error ? error.message : "Failed to update the seat type. Please try again.");
        return;
      }
    } else {
      // Add new seat type
      const newSeatType: SeatType = {
        id: `st-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        pricePerHour: formData.pricePerHour,
        amenities: amenitiesArray,
        color: formData.color,
        libraryId: "lib-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        console.log("Creating new seat type:", newSeatType);
        console.log("User library ID:", user.libraryId);
        const response = await fetch(`/api/seats/seattype/libraries/${user.libraryId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Type: formData.name,
            description: formData.description,
            pricePerHour: formData.pricePerHour,
            amenities: amenitiesArray,
            color: formData.color,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create seat type");
        }

        const data = await response.json();
        if (!data.success || !data.data) {
          throw new Error(data.message || "Failed to create seat type");
        }

        // Transform the response data to match frontend types
        const createdSeatType: SeatType = {
          ...data.data,
          name: String(data.data.name),
          description: String(data.data.description || formData.description),
          color: String(data.data.color || formData.color),
          amenities: data.data.amenities || amenitiesArray,
          pricePerHour: data.data.pricePerHour || formData.pricePerHour,
          createdAt: data.data.createdAt || new Date().toISOString(),
          updatedAt: data.data.updatedAt || new Date().toISOString(),
        };

        setSeatTypes((prev) => [...prev, createdSeatType]);

        toast.success(`"${formData.name}" has been added successfully.`);
      } catch (error) {
        console.error("Error creating seat type:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create the seat type. Please try again.");
        return;
      }
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      pricePerHour: 0,
      amenities: "",
      color: "#3B82F6",
    });
    setEditingSeatType(null);
    setIsAddDialogOpen(false);
    clearDraft(); // Clear draft after successful submission
  };

  const handleEdit = (seatType: SeatType) => {
    setEditingSeatType(seatType);
    setFormData({
      name: seatType.name,
      description: String(seatType.description),
      pricePerHour: seatType.pricePerHour || 0,
      amenities: (seatType.amenities || []).join(", "),
      color: String(seatType.color),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (seatTypeId: string) => {
    try {
      const response = await fetch(`/api/seats/seattype/${seatTypeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete seat type");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to delete seat type");
      }

      setSeatTypes((prev) => prev.filter((st) => st.id !== seatTypeId));
      toast.success("The seat type has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting seat type:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete the seat type. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pricePerHour: 0,
      amenities: "",
      color: "#3B82F6",
    });
    setEditingSeatType(null);
  };

  return (
    <div className="space-y-6 pb-30 min-w-[71vw]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Seat Types Management
        </h1>
        <p className="text-muted-foreground">
          Manage different types of seats and their pricing
        </p>
      </div>

      <div className="flex justify-end">
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Seat Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-amber-50">
            <DialogHeader>
              <DialogTitle>
                {editingSeatType ? "Edit Seat Type" : "Add New Seat Type"}
              </DialogTitle>
              <DialogDescription>
                {editingSeatType
                  ? "Update the seat type details"
                  : "Create a new seat type for your library"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Premium Desk"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
                  <Input
                    id="pricePerHour"
                    name="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the seat type and its features"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="e.g. Power Outlet, Reading Light, USB Charging"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-16 h-10"
                  />
                  <span className="text-sm text-muted-foreground">
                    Choose a color for this seat type
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingSeatType ? "Update" : "Add"} Seat Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading || authLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seatTypes.map((seatType) => (
            <Card key={seatType.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: String(seatType.color) }}
                    />
                    <CardTitle className="text-lg">{seatType.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(seatType)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(seatType.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{String(seatType.description)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price per Hour</span>
                  <span className="text-lg font-bold">
                    ₹{seatType.pricePerHour || 0}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Amenities</span>
                  <div className="flex flex-wrap gap-1">
                    {(seatType.amenities || []).map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Armchair className="h-4 w-4" />
                  <span>
                    Created {seatType.createdAt ? new Date(seatType.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !authLoading && seatTypes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Armchair className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No seat types found</h3>
          <p className="text-muted-foreground">
            Create your first seat type to get started
          </p>
        </div>
      )}
    </div>
  );
}
