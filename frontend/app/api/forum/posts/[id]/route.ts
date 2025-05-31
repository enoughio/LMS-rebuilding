
import { type NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

const API_BASE_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get session and handle authentication
    const session = await auth0.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get access token
    const { token: accessToken } = await auth0.getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 })
    }

    console.log("Fetching from Node.js API:", `${API_BASE_URL}/api/forum/${id}`)

    // Make request to Node.js backend
    const response = await fetch(`${API_BASE_URL}/api/forum/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error(`Backend API error: ${response.status}`)

      if (response.status === 404) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }

      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json({ error: errorData.error || "Failed to fetch post" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in API route:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth0.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { token: accessToken } = await auth0.getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 })
    }

    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/api/forum/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json({ error: errorData.error || "Failed to update post" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating forum post:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth0.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { token: accessToken } = await auth0.getAccessToken()

    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/forum/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      return NextResponse.json({ error: errorData.error || "Failed to delete post" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error deleting forum post:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
