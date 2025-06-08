import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';
const API_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

// GET - Fetch all seat bookings for a library
export const GET = (async function handler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const { accessToken } = await getAccessToken(req, NextResponse.next());
    const { id: libraryId } = await params;
  
    if (!libraryId) {
      return NextResponse.json({ error: 'Library ID is required' }, { status: 400 });
    }
  
    const session = await auth0.getSession()
    if(!session){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token: accessToken } = await auth0.getAccessToken()
    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
    }

    const response = await fetch(`${API_URL}/api/seat-bookings/${libraryId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error || 'Failed to fetch bookings' }, { status: response.status });
    }

    const bookings = await response.json();
    return NextResponse.json(bookings);

  } catch (error) {
    console.error('Error fetching seat bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});