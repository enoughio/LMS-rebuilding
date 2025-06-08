import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Bad Request", message: "Booking ID is required" },
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

    const response = await fetch(`${API_URL}/api/seats/download-bill/${bookingId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: errorData.error || "Failed to download bill" },
        { status: response.status || 500 }
      );
    }

    // Get the PDF file as a blob
    const pdfBuffer = await response.arrayBuffer();
    
    // Return the PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="booking_bill_${bookingId}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Error downloading bill:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
