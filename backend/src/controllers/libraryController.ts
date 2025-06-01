import { Request, Response } from "express";
import prisma from "../lib/prisma.js";


export const getAllLibraries = async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;
  const search = req.query.search as string || '';
  const city = req.query.city as string || '';
  const minSeats = req.query.minSeats ? (req.query.minSeats as string).split(',').map(Number) : [];
  const membership = req.query.membership ? (req.query.membership as string).split(',') : [];
  const minRating = req.query.minRating ? (req.query.minRating as string).split(',').map(Number) : [];

  try {
    let filter: any = {
      status: 'APPROVED',
      isActive: true,
    };

    // Search filter
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // City filter
    if (city) {
      filter.city = { contains: city, mode: 'insensitive' };
    }

    // Rating filter
    if (minRating.length > 0) {
      filter.rating = { gte: Math.min(...minRating) };
    }

    // Membership filter
    if (membership.length > 0) {
      filter.membershipPlans = {
        some: {
          price: membership.includes('Free') && membership.includes('Paid')
            ? undefined
            : membership.includes('Free')
            ? { equals: 0 }
            : { gt: 0 },
          isActive: true,
        },
      };
    }

    // Available seats filter
    const seatFilter: any = { isActive: true, isAvailable: true };
    if (minSeats.length > 0) {
      // We'll handle seat count in the aggregation
    }

    // Get total count for pagination

    const totalCount = await prisma.library.count({ where: filter });

    const libraries = await prisma.library.findMany({
      where: filter,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true,
        description: true,
        images: true,
        createdAt: true,
        rating: true,
        reviewCount: true,
        amenities: true,
        totalSeats: true,
        openingHours: {
          select: {
            id: true,
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
            isClosed: true,
          },
          orderBy: { dayOfWeek: 'asc' },
        },
        _count: {
          select: {
            seats: { where: seatFilter },
          },
        },
        membershipPlans: {
          select: {
            id: true,
            price: true,
          },
          where: { isActive: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Filter libraries by available seats ranges
    const filteredLibraries = libraries.filter((library) => {
      const availableSeats = library._count.seats;
      if (minSeats.length === 0) return true;
      return minSeats.some((range) => {
        if (range === 0) return availableSeats >= 0 && availableSeats <= 10;
        if (range === 10) return availableSeats > 10 && availableSeats <= 20;
        if (range === 20) return availableSeats > 20;
        return false;
      });
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: {
        libraries: filteredLibraries.map((library) => ({
          ...library,
          availableSeats: library._count.seats,
          hasFreeMembership: library.membershipPlans.some((plan) => plan.price === 0),
          hasPaidMembership: library.membershipPlans.some((plan) => plan.price > 0),
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching libraries:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch libraries',
    });
  }
};




export const getLibraryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const library = await prisma.library.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        email: true,
        phone: true,
        images: true,
        rating: true,
        reviewCount: true,
        amenities: true,
        totalSeats: true,
        status: true,
        isActive: true,
        openingHours: {
          select: {
            id: true,
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
            isClosed: true,
          },
          orderBy: { dayOfWeek: 'asc' },
        },
        seatPrices: {
          select: {
            id: true,
            seatType: true,
            price: true,
            currency: true,
            isHourly: true,
          },
        },
        seats: {
          select: {
            id: true,
            seatType: true,
            isAvailable: true,
            isActive: true,
          },
          where: { isActive: true },
        },
        membershipPlans: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            features: true,
            isActive: true,
          },
          where: { isActive: true },
        },
      },
    });

    if (!library || !library.isActive || library.status !== 'APPROVED') {
       res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Library not found or not approved',
      });
      return
    }

    // Aggregate seat availability by seat type
    const seatTypes = library.seatPrices.map((seatPrice) => {
      const seatsOfType = library.seats.filter((seat) => seat.seatType === seatPrice.seatType);
      const availableSeats = seatsOfType.filter((seat) => seat.isAvailable).length;
      return {
        type: seatPrice.seatType,
        price: seatPrice.price,
        currency: seatPrice.currency,
        isHourly: seatPrice.isHourly,
        availableSeats,
        totalSeats: seatsOfType.length,
      };
    });

    const formattedLibrary = {
      ...library,
      seatTypes,
      hasFreeMembership: library.membershipPlans.some((plan) => plan.price === 0),
      hasPaidMembership: library.membershipPlans.some((plan) => plan.price > 0),
      isOpen: library.openingHours.some(
        (hour) =>
          !hour.isClosed &&
          new Date().getHours() >= parseInt(hour.openTime.split(':')[0]) &&
          new Date().getHours() < parseInt(hour.closeTime.split(':')[0])
      ),
    };

    res.status(200).json({
      success: true,
      data: formattedLibrary,
    });
  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch library details',
    });
  }
};



interface LibraryRegistrationRequest extends Request {
  body: {
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
    
    // From Next.js API
    adminId: string; // Auth0 user ID
    userEmail: string;
    userName: string;
  };
}


export const registerLibrary = async (req: LibraryRegistrationRequest, res: Response) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      country,
      postalCode,
      email,
      phone,
      images,
      amenities,
      totalSeats,
      additionalInformation,
      adminBio,
      adminCompleteAddress,
      adminPhone,
      adminGovernmentId,
      adminPhoto,
      openingHours,
      adminId,
      userEmail,
      userName
    } = req.body;

    // Check for existing library outside transaction first
    const existingLibraryCheck = await prisma.library.findFirst({
      where: {
        OR: [
          { name: name },
          { email: email },
        ]
      }
    });

    if (existingLibraryCheck) {
     res.status(400).json({
        success: false,
        error: 'Library already exists',
        message: 'A library with this name or email already exists.'
      });
      return
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if user exists, if not create one
      let user = await tx.user.findUnique({
        where: { auth0UserId: adminId }
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            auth0UserId: adminId,
            name: userName,
            email: userEmail,
            role: 'MEMBER' // Will be updated to ADMIN after library approval
          }
        });
      }

      // Check if user is already admin of another library
      const existingAdmin = await tx.library.findFirst({
        where: {
          adminId: user.id,
        }
      });

      if (existingAdmin) {
        // throw new Error('User is already an admin of another library');
        res.status(400).json({
          success: false,
          error: 'User is already an admin of another library',
          message: 'A user can only be an admin of one library at a time.'
        });
        return;
      }

      // 3. Create the library
      const library = await tx.library.create({
        data: {
          name,
          description,
          address,
          city,
          state,
          country,
          postalCode,
          email,
          phone,
          images,
          amenities,
          totalSeats,
          additinalInformation: additionalInformation, // Note: matches schema typo
          AdminBio: adminBio,
          AdminCompleteAddress: adminCompleteAddress,
          AdminPhone: adminPhone,
          AdminGovernmentId: adminGovernmentId,
          AdminPhoto: adminPhoto,
          status: 'PENDING', // Will be reviewed by admin
          isActive: false, // Activated after approval
          adminId: user.id
        }
      });
      
      // 4. Create opening hours
      if (openingHours && openingHours.length > 0) {
        const openingHoursData = openingHours.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isClosed: hour.isClosed,
          libraryId: library.id
        }));

        await tx.openingHour.createMany({
          data: openingHoursData
        });
      }

      return { library, user };
    });

     res.status(201).json({
      success: true,
      message: 'Library registered successfully. It will be reviewed by an admin.',
      data: {
        library: result?.library,
        user: result?.user
      }
    });
    return;
    
  } catch (error) {
    console.error('Error registering library:', error);
    
    // Handle specific error for existing admin
    if (error instanceof Error && error.message === 'User is already an admin of another library') {
       res.status(400).json({
        success: false,
        error: 'You already have a library',
        message: 'A user can only be an admin of one library at a time.'
      });
      return;
    }
    
     res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to register library',
    });
  }
}