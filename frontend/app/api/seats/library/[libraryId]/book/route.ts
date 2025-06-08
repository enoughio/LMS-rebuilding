import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

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

    const response = await fetch(`${API_URL}/api/seats/${libraryId}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
    console.error("Error booking seat:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
