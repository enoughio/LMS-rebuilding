import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id : string}> }) {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NODE_BACKEND_URL}/api/libraries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch library details from backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: 'Failed to fetch library details' },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {

    const session = auth0.getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }


        const { token: accessToken } = await auth0.getAccessToken()
        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", message: "Access token is required" },
                { status: 401 }
            );
        }

    const body = await request.json();
    const response = await fetch(`${process.env.NODE_BACKEND_URL}/api/libraries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update library details');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: 'Failed to update library details' },
      { status: 500 }
    );
  }
}