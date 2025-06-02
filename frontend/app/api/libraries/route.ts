

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const minSeats = searchParams.get('minSeats') || '';
  const membership = searchParams.get('membership') || '';
  const minRating = searchParams.get('minRating') || '';

  try {
    const response = await fetch(
      `${process.env.NODE_BACKEND_URL}/api/libraries?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}&city=${encodeURIComponent(city)}&minSeats=${minSeats}&membership=${membership}&minRating=${minRating}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch libraries from backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: 'Failed to fetch libraries' },
      { status: 500 }
    );
  }
}



