import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

export async function GET() {
  try {
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

    const response = await fetch(`${API_URL}/api/dashboard/growth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch platform growth data:", errorData.message);
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to fetch platform growth data" },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", message: "Failed to fetch platform growth data" },
      { status: 500 }
    );
  }
}