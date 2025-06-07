// import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

// Get seat availability by library ID with query parameters
export async function GET( request: Request, 
  { params }: { params: Promise<{ libraryId: string }> }
) {
  try {
    
    const { libraryId: id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid Library ID" },
        { status: 400 }
      );
    }

    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const seatTypeId = searchParams.get('seatTypeId');

    // Validate required date parameter
    if (!date) {
      return NextResponse.json(
        { error: "Bad Request: Date parameter is required" },
        { status: 400 }
      );
    }

    // Build query string for backend API
    const queryParams = new URLSearchParams();
    queryParams.set('date', date);
    if (seatTypeId) {
      queryParams.set('seatTypeId', seatTypeId);
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/${id}/availability?${queryParams.toString()}`,
    );    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch seat availability:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch seat availability",
        },
        { status: response.status || 500 }
      );
    }       
    const data = await response.json();
    if (!data.success || !data.data) {
        throw new Error("Invalid response structure from backend");
    }
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching seat availability:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while fetching seat availability"
      },
        { status: 500 }
    );}
}
