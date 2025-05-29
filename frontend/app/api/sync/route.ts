import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async function shows() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();
    const apiPort = process.env.API_PORT || 5000;
    const response = await fetch(`http://localhost:${apiPort}/api/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStatus = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
};



export const POST = async function syncUser() {
    try {
        const session = await auth0.getSession();
    
        if (!session) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
        }
    
        const res = new NextResponse();
        const { token: accessToken } = await auth0.getAccessToken();
        const apiPort = process.env.API_PORT || 5000;
        const response = await fetch(`http://localhost:${apiPort}/api/sync-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ userId: session.user.sub })
        });
    
        if (!response.ok) {
        throw new Error('Failed to sync user');
        }
    
        const data = await response.json();
        return NextResponse.json(data, res);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorStatus = (error as { status?: number }).status || 500;
        return NextResponse.json({ error: errorMessage }, { status: errorStatus });
    }
    }