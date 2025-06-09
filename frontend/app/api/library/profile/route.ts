import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET() {
  try {

    const session  = await auth0.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }


    const { token : accessToken } = await auth0.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No access token found' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/library/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch library profile', message: data.message },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in library profile GET:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch library profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No access token found' },
        { status: 401 }
      );
    }

    // Check if the request contains FormData (for file uploads)
    const contentType = request.headers.get('content-type') || '';
    let body;
    let headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
    };

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (files + other data)
      const formData = await request.formData();
      
      // Create a new FormData to forward to the backend
      const backendFormData = new FormData();
      
      // Copy all form fields to the new FormData
      for (const [key, value] of formData.entries()) {
        backendFormData.append(key, value);
      }
      
      body = backendFormData;
      // Don't set Content-Type header, let the browser set it with boundary
    } else {
      // Handle regular JSON data
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BACKEND_URL}/api/library/profile`, {
      method: 'PUT',
      headers,
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to update library profile', message: data.message },
        { status: response.status }
      );
    }
    
    console.log('Library profile updated successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in library profile PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to update library profile' },
      { status: 500 }
    );
  }
}