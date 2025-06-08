

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

  const API_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

  try {
    const backendUrl = `${API_URL}/api/libraries?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}&city=${encodeURIComponent(city)}&minSeats=${minSeats}&membership=${membership}&minRating=${minRating}`;

    console.log('Fetching from backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: `Failed to fetch libraries: ${errorMessage}` },
      { status: 500 }
    );
  }
}



