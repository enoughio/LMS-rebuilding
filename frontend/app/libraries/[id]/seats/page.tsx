'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Seat {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
  floor: number;
  section: string;
  price: {
    price: number;
    hourlyRate: boolean;
    currency: string;
  } | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    libraryId: string;
    seats: Seat[];
    totalSeats: number;
  };
}

const LibrarySeats = () => {
  const params = useParams();
  const libraryId = params?.id as string | undefined;
  const [seats, setSeats] = useState<Seat[]>([]);
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      // Validate libraryId
      if (!libraryId || typeof libraryId !== 'string') {
        setError('Invalid or missing library ID');
        setLoading(false);
        return;
      }

      setLoading(true);
    try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost5000'}/api/bookings/${libraryId}/seats`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setSeats(data.data.seats);
          setTotalSeats(data.data.totalSeats);
        } else {
          setError(data.message);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch seats');
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [libraryId]);

  if (!libraryId) {
    return <div className="text-center py-4 text-red-500">Library ID is required</div>;
  }

  if (loading) {
    return <div className="text-center py-4">Loading seats...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (seats.length === 0) {
    return <div className="text-center py-4">No seats available for this library.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seats for Library</h1>
      <p className="mb-4">Total Seats: {totalSeats}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Availability</th>
              <th className="py-2 px-4 border-b text-left">Floor</th>
              <th className="py-2 px-4 border-b text-left">Section</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Currency</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((seat) => (
              <tr key={seat.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{seat.name}</td>
                <td className="py-2 px-4 border-b">{seat.type}</td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      seat.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {seat.isAvailable ? 'Available' : 'Occupied'}
                </td>
                <td className="py-2 px-4 border-b">{seat.floor}</td>
                <td className="py-2 px-4 border-b">{seat.section || '-'}</td>
                <td className="py-2 px-4 border-b">
                  {seat.price
                    ? `${seat.price.price} ${seat.price.hourlyRate ? '/hr' : ''}`
                    : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">{seat.price?.currency || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarySeats;