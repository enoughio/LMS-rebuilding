'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';

// Define Seat type (aligned with backend getLibrarySeats)
interface Seat {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  floor: number;
  section: string | null;
  price: {
    price: number;
    hourlyRate: boolean;
    currency: string;
  } | null;
}

// Define API response types
interface SeatsResponse {
  success: boolean;
  message: string;
  data: {
    libraryId: string;
    seats: Seat[];
    totalSeats: number;
  };
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    seatId: string;
    durationHours: number;
    totalPrice: number;
    currency: string;
    createdAt: string;
  };
}

// Define BookingForm
interface BookingForm {
  seatId: string;
  durationHours: string;
}

// Define PageProps for dynamic route
interface PageProps {
  params: {
    libraryId: string;
  };
}

export default function SeatBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const { libraryId } = useParams() as PageProps['params'];
  const category = searchParams ? searchParams.get('category') || '' : '';

  const [seats, setSeats] = useState<Seat[]>([]);
  const [formData, setFormData] = useState<BookingForm>({ seatId: '', durationHours: '1' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<string | null>(null);

  // Valid seat categories (aligned with schema's SeatType)
  const validCategories = ['REGULAR', 'QUIET_ZONE', 'COMPUTER', 'STUDY_ROOM', 'GROUP_TABLE'];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const redirectUrl = `/libraries/${libraryId}/seat/booking?category=${encodeURIComponent(category)}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, authLoading, router, libraryId, category]);

  // Validate category and fetch available seats
  useEffect(() => {
    const fetchSeats = async () => {
      if (!libraryId || !category || !user) {
        setIsLoading(false);
        return;
      }

      // Validate category
      if (!validCategories.includes(category)) {
        setError(`Invalid seat category: ${category}. Please select a valid category.`);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const url = `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/bookings/${libraryId}/seats?category=${encodeURIComponent(category)}`;
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch seats: ${response.status}`);
        }

        const data: SeatsResponse = await response.json();
        if (data.success) {
          setSeats(data.data.seats.filter((seat) => seat.isAvailable));
        } else {
          throw new Error(data.message || 'Failed to fetch seats');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while fetching seats';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [libraryId, category, user]);

  // Calculate total price when seat or duration changes
  useEffect(() => {
    const selectedSeat = seats.find((seat) => seat.id === formData.seatId);
    if (selectedSeat && selectedSeat.price) {
      const hours = parseInt(formData.durationHours);
      const price = selectedSeat.price.hourlyRate
        ? selectedSeat.price.price * hours
        : selectedSeat.price.price;
      setTotalPrice(`${price.toFixed(2)} ${selectedSeat.price.currency}`);
    } else {
      setTotalPrice(null);
    }
  }, [formData.seatId, formData.durationHours, seats]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/bookings`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          libraryId,
          seatId: formData.seatId,
          category,
          durationHours: parseInt(formData.durationHours),
        }),
      });

      const data: BookingResponse = await response.json();
      if (!response.ok || !data.success) {
        // Handle specific backend errors
        const errorMessage = data.message || `Failed to book seat: ${response.status}`;
        if (errorMessage.includes('already booked')) {
          throw new Error('This seat is no longer available. Please choose another seat.');
        } else if (errorMessage.includes('Library is not available')) {
          throw new Error('This library is not available for booking at this time.');
        } else {
          throw new Error(errorMessage);
        }
      }

      toast.success('Seat booked successfully!', { position: 'top-right' });
      router.push('/dashboard/member');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while booking';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#ECE3DA]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Handled by useEffect redirect
  }

  if (!libraryId || !category) {
    return (
      <div className="p-4 text-red-500">Missing library ID or seat category.</div>
    );
  }

  return (
    <div className="flex h-screen max-w-[1920px] items-center justify-center bg-[#ECE3DA] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Book a Seat</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {seats.length === 0 ? (
            <p className="text-gray-600">
              {isLoading ? 'Loading seats...' : `No available seats for category: ${category}`}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seatId">Select Seat</Label>
                <Select
                  value={formData.seatId}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, seatId: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="seatId">
                    <SelectValue placeholder="Choose a seat" />
                  </SelectTrigger>
                  <SelectContent>
                    {seats.map((seat) => (
                      <SelectItem key={seat.id} value={seat.id}>
                        {seat.name} (Floor {seat.floor}
                        {seat.section ? `, ${seat.section}` : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationHours">Booking Duration (Hours)</Label>
                <Select
                  value={formData.durationHours}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, durationHours: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="durationHours">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((hours) => (
                      <SelectItem key={hours} value={hours.toString()}>
                        {hours} {hours === 1 ? 'hour' : 'hours'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {totalPrice && (
                <p className="text-sm text-gray-600">
                  Total Cost: {totalPrice}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-slate-600 hover:bg-slate-700"
                disabled={isSubmitting || !formData.seatId}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Book Seat <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}