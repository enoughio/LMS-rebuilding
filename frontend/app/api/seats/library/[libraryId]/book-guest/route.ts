import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ libraryId: string }> }
) {
  try {
    const { libraryId } = await params;

    if (!libraryId) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Library ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate guest booking data
    if (!body.guestBooking || !body.guestBooking.name || !body.guestBooking.email || !body.guestBooking.phone) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Guest information (name, email, phone) is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/api/seats/${libraryId}/book-guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.error || "Failed to book seat" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error booking seat as guest:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
