"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Armchair,
  CreditCard,
  Loader2,
  Download,
  CheckCircle,
  User,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/context/AuthContext";

// Interface for seat data from API
interface SeatData {
  id: string;
  name: string;
  position: unknown;
  isAvailable: boolean;
  isActive: boolean;
  seatTypeId: string;
  libraryId: string;
  seatType: {
    id: string;
    name: string;
    pricePerHour: number;
    description: string;
    color: string;
    amenities: string[];
    isActive: boolean;
    libraryId: string;
  };
  bookings: unknown[];
}

// Interface for seat type data from API
interface SeatTypeData {
  id: string;
  name: string;
  pricePerHour: number;
  description: string;
  color: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  libraryId: string;
  totalSeats: number;
  availableSeats: number;
  occupiedSeats: number;
}

// Interface for availability API response
interface AvailabilitySeat {
  seatId: string;
  name: string;
  seatType: {
    id: string;
    name: string;
    pricePerHour: number;
    description: string;
    color: string;
    amenities: string[];
  };
  isAvailable: boolean;
  isActive: boolean;
  bookedSlots: {
    bookingId: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
  totalBookings: number;
}

interface LibraryData {
  id: string;
  name: string;
  address: string;
  description: string;
  email: string;
  phone: string;
}

// Interface for booking result from API
interface BookingResult {
  booking: {
    id: string;
    seatName: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  payment: {
    amount: number;
  };
}

export default function GuestBookingSeatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialSeatTypeId = searchParams.get("seatType");

  const [library, setLibrary] = useState<LibraryData | null>(null);
  const [seatTypes, setSeatTypes] = useState<SeatTypeData[]>([]);
  const [selectedSeatTypeId, setSelectedSeatTypeId] = useState<string | null>(initialSeatTypeId);
  const [allSeats, setAllSeats] = useState<SeatData[]>([]);
  const [filteredSeats, setFilteredSeats] = useState<SeatData[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guest information
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");

  // Booking result state
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [showBillDownload, setShowBillDownload] = useState(false);

  // Fetch initial library and seats data
  useEffect(() => {
    const fetchLibraryAndSeats = async () => {
      if (!user || !user.libraryId) {
        setError("You must be logged in to book a seat");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch library seats and seat types
        const [seatResponse, seatTypesResponse] = await Promise.all([
          fetch(`/api/seats/library/${user.libraryId}`),
          fetch(`/api/seats/seattype/libraries/${user.libraryId}`),
        ]);

        if (!seatResponse.ok) {
          throw new Error("Failed to fetch seats data");
        }
        
        if (!seatTypesResponse.ok) {
          throw new Error("Failed to fetch seat types data");
        }

        const seatsResult = await seatResponse.json();
        const seatTypesResult = await seatTypesResponse.json();

        if (!seatsResult.success) {
          throw new Error(seatsResult.message || "Failed to fetch seats data");
        }

        if (!seatTypesResult.success) {
          throw new Error(seatTypesResult.message || "Failed to fetch seat types data");
        }

        // Set library and seats data
        setLibrary(seatsResult.data.library);
        setAllSeats(seatsResult.data.seats);
        setSeatTypes(seatTypesResult.data);

        // Filter seats by seat type if specified
        const filtered = selectedSeatTypeId
          ? seatsResult.data.seats.filter(
              (seat: SeatData) => seat.seatTypeId === selectedSeatTypeId
            )
          : seatsResult.data.seats;

        setFilteredSeats(filtered);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load seat selection data";
        setError(errorMessage);
        toast.error(errorMessage, { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryAndSeats();
  }, [user, authLoading, selectedSeatTypeId]);
  // Effect to check availability when date changes
  useEffect(() => {
    const checkSeatAvailability = async (date: string) => {
      if (!user?.libraryId || allSeats.length === 0) return;

      setLoadingAvailability(true);

      try {
        const params = new URLSearchParams({ date });
        if (selectedSeatTypeId) params.append("seatTypeId", selectedSeatTypeId);

        const response = await fetch(
          `/api/seats/library/${user.libraryId}/availability?${params.toString()}`
        );
        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to check seat availability"
          );
        }

        // Update filtered seats with availability info
        const availabilityData = result.data.availability as AvailabilitySeat[];
        
        // Get the current filtered seats based on seat type selection
        const currentFilteredSeats = selectedSeatTypeId && selectedSeatTypeId !== "all"
          ? allSeats.filter((seat: SeatData) => seat.seatTypeId === selectedSeatTypeId)
          : allSeats;

        const updatedSeats = currentFilteredSeats.map((seat) => {
          const availInfo = availabilityData.find(
            (avail) => avail.seatId === seat.id
          );
          return {
            ...seat,
            isAvailable: availInfo?.isAvailable ?? seat.isAvailable,
          };
        });

        setFilteredSeats(updatedSeats);

        // Clear selection if currently selected seat is no longer available
        if (selectedSeat) {
          const selectedSeatInfo = updatedSeats.find(
            (s) => s.id === selectedSeat
          );
          if (selectedSeatInfo && !selectedSeatInfo.isAvailable) {
            setSelectedSeat(null);
            toast.success("Selected seat is no longer available", { duration: 2000 });
          }
        }
      } catch (error) {
        console.error("Error checking seat availability:", error);
        toast.error("Failed to check seat availability", { duration: 2000 });
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (selectedDate && allSeats.length > 0) {
      checkSeatAvailability(selectedDate);
    }
  }, [selectedDate, allSeats, selectedSeatTypeId, user?.libraryId, selectedSeat]);

  // Handle seat type change
  const handleSeatTypeChange = (seatTypeId: string) => {
    setSelectedSeatTypeId(seatTypeId);
    setSelectedSeat(null); // Clear selection when seat type changes

    // Filter seats by new seat type
    const filtered = seatTypeId === "all" 
      ? allSeats
      : allSeats.filter((seat: SeatData) => seat.seatTypeId === seatTypeId);
    
    setFilteredSeats(filtered);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSeat(null); // Clear selection when date changes
  };

  const handleBookSeat = async () => {
    if (!selectedSeat) {
      toast.error("Please select a seat to continue", { duration: 2000 });
      return;
    }

    if (!guestName || !guestEmail || !guestPhone) {
      toast.error("Please fill in all guest information fields", {
        duration: 2000,
      });
      return;
    }

    setBookingInProgress(true);

    try {
      const selectedSeatData = filteredSeats.find((s) => s.id === selectedSeat);
      if (!selectedSeatData) {
        throw new Error("Selected seat not found");
      }

      // Calculate end time based on start time and duration
      const startHour = parseInt(selectedTime.split(":")[0]);
      const startMinute = parseInt(selectedTime.split(":")[1]);
      const endHour = startHour + duration;
      const endMinute = startMinute;
      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
        .toString()
        .padStart(2, "0")}`;

      const bookingData = {
        seatId: selectedSeat,
        date: selectedDate,
        startTime: selectedTime,
        endTime: endTime,
        duration: duration,
        paymentMethod: "OFFLINE",
        guestBooking: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        },
      };

      const response = await fetch(`/api/seats/library/${user?.libraryId}/book-guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to book seat");
      }

      if (!result.success) {
        throw new Error(result.error || "Booking failed");
      }

      setBookingResult(result.data);
      setShowBillDownload(true);
      toast.success(
        `${selectedSeatData.seatType.name} seat has been booked successfully!`,
        { duration: 3000 }
      );

      // Reset form
      setSelectedSeat(null);
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");

      // Update seat availability immediately
      const updatedSeats = filteredSeats.map((seat) =>
        seat.id === selectedSeat ? { ...seat, isAvailable: false } : seat
      );
      setFilteredSeats(updatedSeats);
    } catch (error) {
      console.error("Error booking seat:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "There was an error booking your seat. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleDownloadBill = async () => {
    if (!bookingResult?.booking?.id) {
      toast.error("Booking information not available", { duration: 2000 });
      return;
    }

    try {
      const response = await fetch(
        `/api/seats/download-bill/${bookingResult.booking.id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download bill");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `booking_bill_${bookingResult.booking.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Bill downloaded successfully!", { duration: 2000 });
    } catch (error) {
      console.error("Error downloading bill:", error);
      toast.error("Failed to download bill. Please try again.", {
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col min-w-[70vw]">
        <div className="container flex flex-1 items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading seat selection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !library) {
    return (
      <div className="flex min-h-screen flex-col min-w-[70vw]">
        <div className="container flex flex-1 items-center justify-center py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {error || "Library not found"}
              </p>
              <Button asChild variant="outline" className="bg-gray-500">
                <Link href="/dashboard/admin">Back to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get selected seat type info
  const selectedSeatTypeInfo = selectedSeatTypeId 
    ? seatTypes.find(st => st.id === selectedSeatTypeId)
    : null;
  
  const selectedSeatData = selectedSeat 
    ? filteredSeats.find(s => s.id === selectedSeat)
    : null;

  const totalPrice = selectedSeatData 
    ? selectedSeatData.seatType.pricePerHour * duration 
    : 0;

  return (
    <div className="flex min-h-screen flex-col md:pb-30">
      {/* Header */}
      <div className="border-b  sticky top-0 z-10">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" className="bg-gray-900 text-white" size="sm" asChild>
            <Link href="/dashboard/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <h1 className="font-semibold">Guest Booking</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {library.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex-1 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Guest Information */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Information
              </CardTitle>
              <CardDescription>
                Please provide guest contact information for the booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name *</Label>
                <Input
                  id="guest-name"
                  placeholder="Enter guest's full name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-email">Email Address *</Label>
                <Input
                  id="guest-email"
                  type="email"
                  placeholder="Enter guest's email address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-phone">Phone Number *</Label>
                <Input
                  id="guest-phone"
                  type="tel"
                  placeholder="Enter guest's phone number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seat Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Armchair className="h-5 w-5" />
                Available Seats
                {selectedSeatTypeInfo && (
                  <Badge variant="secondary">
                    {selectedSeatTypeInfo.name} - ₹{selectedSeatTypeInfo.pricePerHour}/hour
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Select preferred seat and time slot for the guest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seat Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="seat-type">Seat Type</Label>
                <Select value={selectedSeatTypeId || "all"} onValueChange={handleSeatTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select seat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Seat Types</SelectItem>
                    {seatTypes.map((seatType) => (
                      <SelectItem key={seatType.id} value={seatType.id}>
                        {seatType.name} - ₹{seatType.pricePerHour}/hr ({seatType.availableSeats} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time Selection */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (hours)</Label>
                  <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Seat Grid */}
              {loadingAvailability ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Checking availability...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span>Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredSeats.map((seat) => (
                      <Button
                        key={seat.id}
                        variant={selectedSeat === seat.id ? "default" : "outline"}
                        size="sm"
                        disabled={!seat.isAvailable}
                        onClick={() => setSelectedSeat(seat.id)}
                        className={`h-16 p-2  ${
                          !seat.isAvailable
                            ? "opacity-50 cursor-not-allowed bg-red-50 border-red-200"
                            : selectedSeat === seat.id
                            ? "bg-blue-100 border-blue-300 text-blue-900"
                            : "hover:bg-green-50 border-green-200"
                        }`}
                        style={{
                          backgroundColor: !seat.isAvailable 
                            ? "#fef2f2" 
                            : selectedSeat === seat.id 
                            ? "#dbeafe" 
                            : "#f0fdf4"
                        }}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium">{seat.name}</div>
                          <div className="text-xs opacity-75">
                            {seat.seatType.name}
                          </div>
                          <div className="text-xs opacity-75">
                            {seat.isAvailable ? "Available" : "Booked"}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>

                  {filteredSeats.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No seats available for the selected criteria
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        {selectedSeat && selectedSeatData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest Name:</span>
                    <span className="font-medium">{guestName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seat:</span>
                    <span className="font-medium">{selectedSeatData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{selectedSeatData.seatType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {selectedTime} -{" "}
                      {`${(parseInt(selectedTime.split(":")[0]) + duration)
                        .toString()
                        .padStart(2, "0")}:${selectedTime.split(":")[1]}`}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {duration} hour{duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium">
                      ₹{selectedSeatData.seatType.pricePerHour}/hour
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amenities:</span>
                    <div className="text-right">
                      {selectedSeatData.seatType.amenities.slice(0, 2).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="ml-1 text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {selectedSeatData.seatType.amenities.length > 2 && (
                        <Badge variant="outline" className="ml-1 text-xs">
                          +{selectedSeatData.seatType.amenities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBookSeat}
                disabled={
                  bookingInProgress || !guestName || !guestEmail || !guestPhone
                }
                className="w-full bg-gray-900 text-white"
                size="lg"
              >
                {bookingInProgress ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Booking...
                  </>
                ) : (
                  `Confirm Booking - ₹${totalPrice}`
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showBillDownload} onOpenChange={setShowBillDownload}>
        <DialogContent className="sm:max-w-md bg-amber-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              The guest seat has been successfully booked. You can download the
              booking bill below.
            </DialogDescription>
          </DialogHeader>

          {bookingResult && (
            <div className="space-y-2 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-medium">{bookingResult.booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guest:</span>
                <span className="font-medium">{guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">
                  ₹{bookingResult.payment.amount}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button className="bg-gray-900 text-white"
              variant="outline"
              onClick={() => setShowBillDownload(false)}
            >
              Close
            </Button>
            <Button onClick={handleDownloadBill} className="gap-2">
              <Download className="h-4 w-4 bg-gray-900 text-white" />
              Download Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
