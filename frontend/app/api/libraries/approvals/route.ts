import { auth0 } from "@/lib/auth0";
import {  NextResponse } from "next/server";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
    // Get session
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Get access token
    const { token: accessToken } = await auth0.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { message: "Unauthorized. Access token not found." },
        { status: 401 }
      );
    }

    // Send request to backend
    const response = await fetch(`${API_URL}/api/libraries/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const data = await response.json();
    console.log("Response from backend:", data);

    if (!response.ok) {
      console.error("Failed to fetch approvals from backend:", data.message);
      return NextResponse.json(
        { success: false,  message: data.message || "Failed to fetch approvals" },
        { status: response.status || 500 }
      );
      // throw new Error("Failed to fetch approvals from backend");
    }

    // const data = await response.json();
    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/libraries/requests:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", message: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}
