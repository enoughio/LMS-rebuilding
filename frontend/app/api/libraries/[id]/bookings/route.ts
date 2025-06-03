import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { libraryId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const url = new URL(`/api/libraries/${params.libraryId}/bookings`, 
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    );
    
    // Add query parameters
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    if (search) url.searchParams.set('search', search);
    if (status) url.searchParams.set('status', status);
    if (startDate) url.searchParams.set('startDate', startDate);
    if (endDate) url.searchParams.set('endDate', endDate);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching library bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: 'Failed to fetch library bookings' },
      { status: 500 }
    );
  }
}
