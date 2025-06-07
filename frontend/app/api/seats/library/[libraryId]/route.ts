import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

// Get seats by library ID
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

    const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(
      `${API_BASE_URL}/api/seats/${id}/`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch seats:", errorData.message);
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch seats",
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
    console.error("Error fetching seats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: "An error occurred while fetching seats"
      },
        { status: 500 }
    );}
}



export async function POST( request: Request, 
    { params }: { params: Promise<{ libraryId: string }> }
) {
    // Create a new seat

    try {

      const session = await auth0.getSession();
        if (!session ) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized', message: 'No valid session found' },
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


        const { libraryId: id } = await params;
        if (!id || typeof id !== "string") {
            return NextResponse.json(
                { error: "Bad Request: Missing or invalid Library ID" },
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

        const { name, seatTypeId } = requestBody;
        if (!name || !seatTypeId) {
            return NextResponse.json(
                { error: "Bad Request: Missing required fields (name, seatTypeId)" },
                { status: 400 }
            );
        }

        const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(
            `${API_BASE_URL}/api/seats/library/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to create seat:", errorData.message);
            return NextResponse.json(
                {
                    success: false,
                    message: errorData.message || "Failed to create seat",
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
        console.error("Error creating seat:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
                message: "An error occurred while creating seat"
            },
            { status: 500 }
        );
        
    }

}