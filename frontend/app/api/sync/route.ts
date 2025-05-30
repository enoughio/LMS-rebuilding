import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

// // return a dummy response for now
// export const GET = async function syncUser() {
//     NextResponse.json({ message: 'Sync user endpoint is under construction' }, { status: 200 });
// }

export const POST = async function syncUser() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();
    const API_BASE_URL =
      process.env.NODE_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${API_BASE_URL}/api/user/sync-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // body: JSON.stringify({ userId: session.user.sub }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync user");
    }

    const result = await response.json();
    console.log("Synced user result:", result);
    return NextResponse.json(result, res);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStatus = (error as { status?: number }).status || 500;
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
};
