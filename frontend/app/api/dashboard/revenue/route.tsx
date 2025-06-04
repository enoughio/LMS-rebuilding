import { auth0 } from '@/lib/auth0'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000'
    
    const session = await auth0.getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      )}

    const { token: accessToken } = await auth0.getAccessToken()
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'Access token is required' },
        { status: 401 }
        )
    }

    const response = await fetch(`${API_URL}/api/dashboard/revenue`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`)
    }

    const data = await response.json()

    // Validate response structure
    if (!data.success || !data.data) {
      throw new Error('Invalid response structure from backend')
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    )
  }
}