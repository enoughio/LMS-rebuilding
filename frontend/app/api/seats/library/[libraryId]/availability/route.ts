import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(
  request: NextRequest,
  { params }: { params: { libraryId: string } }
) {
  try {
    // Extract libraryId from URL parameters
    const { libraryId } = params;
    
    // Extract date from query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Get user session and access token
    const session = await auth0.getSession();
    const { token: accessToken } = await auth0.getAccessToken().catch(() => ({ token: null }));

    if (!accessToken) {
      console.log("No access token available for seat availability request");
      // Continuing without token for debugging - remove in production
    }

    // API URL from environment variable or default
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    console.log(`Fetching seat availability for library ${libraryId} on date ${date}`);
    console.log(`API URL: ${API_URL}/seats/library/${libraryId}/availability?date=${date}`);

    // Fetch data from backend
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}/seats/library/${libraryId}/availability?date=${date}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API error:", errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: "API Error", 
          message: `Failed to fetch seat availability: ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // For debugging - if there's no data or it's not as expected
    console.log("Response data:", JSON.stringify(data).substring(0, 200) + "...");
    
    // If the API doesn't follow the success/data pattern, transform it
    if (data.success === undefined) {
      return NextResponse.json({
        success: true,
        data: data // Assuming the API returns the array directly
      });
    }
    
    // Otherwise, pass through the response
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Error in seat availability API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Server Error", 
        message: error.message || "Failed to fetch seat availability",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}