import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  try {
    // Get the access token from Auth0
    const { accessToken } = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/user/all?${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch users" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in users API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
