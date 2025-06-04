import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

// Update seat details (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ seatId: string }> }
) {
  try {
    const { seatId } = await params;
    
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Access token is required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/api/seats/seats/${seatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to update seat" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error updating seat:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a seat (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ seatId: string }> }
) {
  try {
    const { seatId } = await params;
    
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "User not authenticated" },
        { status: 401 }
      );
    }

    const { token: accessToken } = await auth0.getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", message: "Access token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/api/seats/seats/${seatId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to delete seat" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error deleting seat:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}