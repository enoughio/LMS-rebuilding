import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const API_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Access token is required' },
        { status: 401 }
      );
    }

    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const libraryId = searchParams.get('libraryId');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (libraryId) queryParams.append('libraryId', libraryId);

    const response = await fetch(`${API_URL}/api/reports/bookings?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch booking analytics:', errorData.message);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to fetch booking analytics' },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      throw new Error('Invalid response structure from backend');
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    console.error('Booking analytics API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
