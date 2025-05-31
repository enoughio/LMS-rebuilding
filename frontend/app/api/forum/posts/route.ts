import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';


// Your Node.js backend URL
const NODE_BACKEND_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Get session for authentication
    // const session = await getServerSession(authOptions);
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'new';
    const period = searchParams.get('period') || 'all';

    // Build query string for Node.js backend
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
      period,
      ...(categoryId && { categoryId }),
      ...(search && { search }),
    });

    // Prepare headers for Node.js backend
    // const headers: Record<string, string> = {
    //   'Content-Type': 'application/json',
    // };

    // Add auth token if user is authenticated
    // if (session?.accessToken) {
    //   headers['Authorization'] = `Bearer ${session.accessToken}`;
    // }

    // Call Node.js backend
    const response = await fetch(`${NODE_BACKEND_URL}/api/forum?${queryParams}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Node.js backend error:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch posts from backend' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}



export async function POST (request: NextRequest) {

  
  try {
    
    const body = await request.json();
        // Validate required fields
    if (!body.title || !body.content || !body.categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title, description, and category are required.' 
        },
        { status: 400 }
      );
    }

    const session = await auth0.getSession()
        if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get access token
    const { token: accessToken } = await auth0.getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 })
    }


    // Call Node.js backend to create a new post
    const response = await fetch(`${NODE_BACKEND_URL}/api/forum/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Node.js backend error:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create post' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}