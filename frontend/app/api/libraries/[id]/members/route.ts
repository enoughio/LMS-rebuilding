import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ libraryId: string }> }
) {
  try {
    const { libraryId } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    const url = new URL(`/api/libraries/${libraryId}/members`, 
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    );
    
    // Add query parameters
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    if (search) url.searchParams.set('search', search);

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
    console.error('Error fetching library members:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', message: 'Failed to fetch library members' },
      { status: 500 }
    );
  }
}
