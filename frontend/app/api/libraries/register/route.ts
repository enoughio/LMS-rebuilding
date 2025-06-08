import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

interface LibraryRegistrationData {
  // Library Information
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  images: string[];
  amenities: string[];
  totalSeats: number;
  additionalInformation?: string;
  
  // Admin Information
  adminBio?: string;
  adminCompleteAddress: string;
  adminPhone: string;
  adminGovernmentId?: string;
  adminPhoto?: string;
  
  // Opening Hours
  openingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();

    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse FormData instead of JSON
    const formData = await request.formData();
    
    // Extract form fields
    const body: LibraryRegistrationData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      country: formData.get('country') as string,
      postalCode: formData.get('postalCode') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      images: [], // Will be handled separately
      amenities: JSON.parse(formData.get('amenities') as string || '[]'),
      totalSeats: parseInt(formData.get('totalSeats') as string),
      additionalInformation: formData.get('additionalInformation') as string,
      adminBio: formData.get('adminBio') as string,
      adminCompleteAddress: formData.get('adminCompleteAddress') as string,
      adminPhone: formData.get('adminPhone') as string,
      adminGovernmentId: formData.get('adminGovernmentId') as string,
      adminPhoto: formData.get('adminPhoto') as string,
      openingHours: JSON.parse(formData.get('openingHours') as string)
    };

    // Basic validation
    type LibraryKey = keyof LibraryRegistrationData;
    const requiredFields: LibraryKey[] = [
      'name', 'description', 'address', 'city', 'state', 
      'country', 'postalCode', 'email', 'phone', 'totalSeats',
      'adminCompleteAddress', 'adminPhone'
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(body.phone) || !phoneRegex.test(body.adminPhone)) {
      return NextResponse.json(
        { message: 'Please provide valid phone numbers' },
        { status: 400 }
      );
    }

    // Total seats validation
    if (body.totalSeats <= 0) {
      return NextResponse.json(
        { message: 'Total seats must be greater than 0' },
        { status: 400 }
      );
    }

    // Opening hours validation
    if (!body.openingHours || !Array.isArray(body.openingHours) || body.openingHours.length !== 7) {
      return NextResponse.json(
        { message: 'Opening hours for all 7 days are required' },
        { status: 400 }
      );
    }

    // Validate each opening hour
    for (let i = 0; i < body.openingHours.length; i++) {
      const hour = body.openingHours[i];
      
      if (hour.dayOfWeek !== i) {
        return NextResponse.json(
          { message: 'Invalid opening hours data' },
          { status: 400 }
        );
      }
      
      if (!hour.isClosed) {
        if (!hour.openTime || !hour.closeTime) {
          return NextResponse.json(
            { message: `Opening and closing times are required for ${getDayName(i)}` },
            { status: 400 }
          );
        }
        
        // Validate time format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(hour.openTime) || !timeRegex.test(hour.closeTime)) {
          return NextResponse.json(
            { message: `Invalid time format for ${getDayName(i)}` },
            { status: 400 }
          );
        }
        
        // Check if close time is after open time
        const [openHour, openMin] = hour.openTime.split(':').map(Number);
        const [closeHour, closeMin] = hour.closeTime.split(':').map(Number);
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;
        
        if (closeMinutes <= openMinutes) {
          return NextResponse.json(
            { message: `Closing time must be after opening time for ${getDayName(i)}` },
            { status: 400 }
          );
        }
      }
    }

    // Prepare data for Node.js API
    const libraryData = {
      // Library basic info
      name: body.name.trim(),
      description: body.description.trim(),
      address: body.address.trim(),
      city: body.city.trim(),
      state: body.state.trim(),
      country: body.country.trim(),
      postalCode: body.postalCode.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      images: body.images || [],
      amenities: body.amenities || [],
      totalSeats: body.totalSeats,
      additinalInformation: body.additionalInformation?.trim() || null, // Note: keeping the typo from schema
      
      // Admin info
      AdminBio: body.adminBio?.trim() || null,
      AdminCompleteAddress: body.adminCompleteAddress.trim(),
      AdminPhone: body.adminPhone.trim(),
      AdminGovernmentId: body.adminGovernmentId || null,
      AdminPhoto: body.adminPhoto || null,
      
      // System fields
      status: 'PENDING',
      isActive: true,
      adminId: session.user.sub, // Auth0 user ID
      
      // Opening hours
      openingHours: body.openingHours.map(hour => ({
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.isClosed ? '00:00' : hour.openTime,
        closeTime: hour.isClosed ? '00:00' : hour.closeTime,
        isClosed: hour.isClosed
      }))
    };

    const { token: accessToken } = await auth0.getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { message: 'Failed to get access token' },
        { status: 401 }
      );
    }

    // Create FormData for Node.js API
    const nodeApiFormData = new FormData();
    nodeApiFormData.append('libraryData', JSON.stringify(libraryData));
    
    // Add image files
    const images = formData.getAll('images') as File[];
    images.forEach((file) => {
      if (file && file.size > 0) {
        nodeApiFormData.append('images', file);
      }
    });

    // Call your Node.js API
    const nodeApiUrl = process.env.NODE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(`${nodeApiUrl}/api/libraries/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // If you need auth in Node.js API
      },
      body: nodeApiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      return NextResponse.json(
        { message: errorData.message || 'Failed to register library' },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      message: 'Library registration submitted successfully! Please wait for admin approval.',
      libraryId: result.libraryId,
      status: 'PENDING'
    }, { status: 201 });

  } catch (error) {
    console.error('Library registration error:', error);
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { message: 'Unable to connect to registration service' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
}

// Helper function to get day name
function getDayName(dayIndex: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || 'Unknown';
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}