import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

// Update seat type
export async function PATCH( request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid seat type ID" },
        { status: 400 }
      );
    }

    const session = auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { token: accessToken } = await auth0.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: Access token not found" },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const { Type, description, pricePerHour, amenities, color } = requestBody;
    
    if (!Type || !description || !pricePerHour || !amenities || !color) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields" },
        { status: 400 }
      );
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/seattype/${id}`,
        {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update seat type:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to update seat type",
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
    console.error("Error updating seat type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while Updating seat type"
      },
        { status: 500 }
    );}
}     


// Delete seat type
export async function DELETE( request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
  try {
        
    const { id } = await params;
    if (!id || typeof id !== "string") {
        return NextResponse.json(
            { error: "Bad Request: Missing or invalid seat type ID" },
            { status: 400 }
        );
        }


    const session = auth0.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { token: accessToken } = await auth0.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: Access token not found" },
        { status: 401 }
      );
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/seattype/${id}`,
        {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to delete seat type:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to delete seat type",
        },
        { status: response.status || 500 }
      );
    }       
    const data = await response.json();
    
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting seat type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while deleting seat type"
      },
        { status: 500 }
    );}
}