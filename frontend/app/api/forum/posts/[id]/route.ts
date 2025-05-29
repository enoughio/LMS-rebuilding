// app/api/forum/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const API_BASE_URL = process.env.NEXT_API_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
  // { params }: { params: { id: string } }
) {
  try {

    const { id } = await params;
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching forum post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
  // { params }: { params: { id: string } }
) {
  try {

    const { id } = await params;
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to update post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating forum post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
  // { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/api/forum/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to delete post' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting forum post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}