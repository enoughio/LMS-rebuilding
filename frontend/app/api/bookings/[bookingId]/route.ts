import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

// PATCH - Cancel a seat booking
export const PATCH = (async function handler(req: NextRequest, { params }: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await params;
    const { action } = await req.json();

      
        const session = await auth0.getSession()
        if(!session){
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    
        const { token: accessToken } = await auth0.getAccessToken()
        if (!accessToken) {
          return NextResponse.json({ error: 'Access token is required' }, { status: 401 });
        }

    let endpoint = '';
    if (action === 'cancel') {
      endpoint = `${API_URL}/api/seat-bookings/${bookingId}/cancel`;
    } else if (action === 'complete') {
      endpoint = `${API_URL}/api/seat-bookings/${bookingId}/complete`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.error || `Failed to ${action} booking` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error(`Error  booking:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});