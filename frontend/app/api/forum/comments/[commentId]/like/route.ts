// /comments/like/:commentId

import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest,
  // context: { params: { commentId: string } }
   { params } : { params :  Promise<{ commentId:  string }> }
) {
  try {
    
    const { commentId  } = await params;
    const session = await auth0.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }


    const API_BASE_URL = process.env.NODE_BACKEND_URL || 'http://localhost:5000';
    const { token: accessToken } = await auth0.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}/api/forum/comments/like/${commentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to like comment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error like forum comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


