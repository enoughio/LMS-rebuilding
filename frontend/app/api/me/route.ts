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
    const API = process.env.NODE_BACKEND_URL || 5000;
    const response = await fetch(`${API}/api/me`, {
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
