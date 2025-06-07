import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

// Update seat
export async function PUT( request: Request, 
  { params }: { params: Promise<{ seatId: string }> }
) {
  try {
    
    const { seatId } = await params;
    if (!seatId || typeof seatId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid seat ID" },
        { status: 400 }
      );
    }

    const requestBody = await request.json();
    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json(
        { error: "Bad Request: Invalid request body" },
        { status: 400 }
      );
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/seats/${seatId}`,
        {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update seat:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to update seat",
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
    console.error("Error updating seat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while updating seat"
      },
        { status: 500 }
    );}
}     



export async function DELETE ( request: Request, 
  { params }: { params: Promise<{ seatId: string }> }
) {
  try {
    
    const { seatId } = await params;
    if (!seatId || typeof seatId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid seat ID" },
        { status: 400 }
      );
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/seats/${seatId}`,
        {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to delete seat:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to delete seat",
        },
        { status: response.status || 500 }
      );
    }       
    const data = await response.json();
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting seat:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while deleting seat"
      },
        { status: 500 }
    );}
}