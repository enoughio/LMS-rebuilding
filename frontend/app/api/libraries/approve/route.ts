import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json() as { id: string };

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Bad Request", message: "Library ID is required" },
                { status: 400 }
            );
        }

        const session = await auth0.getSession();
        
        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const { token: accessToken } = await auth0.getAccessToken()
        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: "Unauthorized", message: "Access token is required" },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_URL}/api/libraries/${id}/approve`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to approve library:", errorData.message);
            return NextResponse.json(
                { success: false, message: errorData.message || "Failed to approve library" },
                { status: response.status || 500 }
            );
        }

        const data = await response.json();
        return NextResponse.json(
            { data: data },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error in POST /api/libraries/approve:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error", message: "Failed to fetch approvals" },
            { status: 500 }
        );
        
    }
}