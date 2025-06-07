import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    // Get Auth0 session
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'No valid session found' },
        { status: 401 }
      );
    }

    // Get the access token from Auth0
    const { token : accessToken } = await auth0.getAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'No access token found' },
        { status: 401 }
      );
    }

    // Call the backend API
    const backendUrl = process.env.NODE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/dashboard/admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: 'Backend Error',
          message: errorData.message || `Backend responded with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in admin dashboard API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
