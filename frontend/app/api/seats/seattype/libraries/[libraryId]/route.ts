import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ libraryId: string }> }
) {

  try {
    const { libraryId } = await params;

    if (!libraryId || typeof libraryId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid libraryId" },
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
      `${API_BASE_URL}/api/seats/seattype/${libraryId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to approve library:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to approve library",
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
    console.error("Error fetching seat types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while fetching seat types",
      },
      { status: 500 }
    );
  }
}


// create seat type
export async function POST(
  request: Request,
  { params }: { params: Promise<{ libraryId: string }> }
) {
  try {
        
    const { libraryId } = await params;

    if (!libraryId || typeof libraryId !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid libraryId" },
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
        { status: 401 }      );
    }
    const body: Record<string, unknown> = {}
    const requestBody = await request.json();
    const { Type, description, pricePerHour, amenities, color } = requestBody;
    if (Type){
        body.Type = Type;
    }

    if (description){
        body.description = description;
    }

    if (pricePerHour){
        body.pricePerHour = pricePerHour;
    }

    if (amenities){
        body.amenities = amenities;
    }

    if (color){
        body.color = color;
    }    // Add libraryId to the body since backend expects it
    body.libraryId = libraryId;

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields" },
        { status: 400 }
      );
    }

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/seattype/${libraryId}`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create seat type:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to create seat type",
        },
        { status: response.status || 500 }
      );
    }       
    const data = await response.json();
    if (!data.success || !data.data) {
        throw new Error("Invalid response structure from backend");
    }
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("Error creating seat type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while creating seat type",
      },
      { status: 500 }
    );
  }   
}

