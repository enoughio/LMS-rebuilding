import {  NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Adjust path as needed

const NODE_BACKEND_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';

export async function GET() {
  try {
    // Get session for authentication
    // const session = await getServerSession(authOptions);

    // Prepare headers for Node.js backend
    // const headers: Record<string, string> = {
    //   'Content-Type': 'application/json',
    // };

    // Add auth token if user is authenticated
    // if (session?.accessToken) {
    //   headers['Authorization'] = `Bearer ${session.accessToken}`;
    // }

    // Call Node.js backend
    const response = await fetch(`${NODE_BACKEND_URL}/api/forum/categories`, {
      method: 'GET',
    //   headers,
    });

    if (!response.ok) {
      console.error('Node.js backend error:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch categories from backend' 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}