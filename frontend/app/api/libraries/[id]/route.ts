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