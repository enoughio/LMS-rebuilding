import prisma from "../lib/prisma.js";
export const getAllLibraries = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const city = req.query.city || '';
    const minSeats = req.query.minSeats ? req.query.minSeats.split(',').map(Number) : [];
    const membership = req.query.membership ? req.query.membership.split(',') : [];
    const minRating = req.query.minRating ? req.query.minRating.split(',').map(Number) : [];
    try {
        let filter = {
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
        const seatFilter = { isActive: true, isAvailable: true };
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
                seats: {
                    select: {
                        id: true,
                        seatType: true,
                        isAvailable: true,
                    },
                    where: { isActive: true },
                },
                seatPrices: {
                    select: {
                        seatType: true,
                        price: true,
                        currency: true,
                        isHourly: true,
                    },
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
        }); // Filter libraries by available seats ranges
        const filteredLibraries = libraries.filter((library) => {
            // Calculate total available seats from all seat types
            const totalAvailableSeats = library.seats.filter((seat) => seat.isAvailable).length;
            if (minSeats.length === 0)
                return true;
            return minSeats.some((range) => {
                if (range === 0)
                    return totalAvailableSeats >= 0 && totalAvailableSeats <= 10;
                if (range === 10)
                    return totalAvailableSeats > 10 && totalAvailableSeats <= 20;
                if (range === 20)
                    return totalAvailableSeats > 20;
                return false;
            });
        });
        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            success: true,
            data: {
                libraries: filteredLibraries.map((library) => {
                    // Calculate seat types availability
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
                    // Calculate total available seats
                    const totalAvailableSeats = seatTypes.reduce((total, seatType) => total + seatType.availableSeats, 0);
                    return {
                        ...library,
                        availableSeats: totalAvailableSeats,
                        seatTypes,
                        hasFreeMembership: library.membershipPlans.some((plan) => plan.price === 0),
                        hasPaidMembership: library.membershipPlans.some((plan) => plan.price > 0),
                    };
                }),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching libraries:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch libraries',
        });
    }
};
export const getLibraryById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Library ID is required',
        });
        return;
    }
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
                AdminBio: true,
                AdminCompleteAddress: true,
                AdminPhone: true,
                AdminGovernmentId: true,
                AdminPhoto: true,
                additinalInformation: true,
                createdAt: true,
                admin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        auth0UserId: true,
                    },
                },
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
            return;
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
            isOpen: library.openingHours.some((hour) => !hour.isClosed &&
                new Date().getHours() >= parseInt(hour.openTime.split(':')[0]) &&
                new Date().getHours() < parseInt(hour.closeTime.split(':')[0])),
        };
        res.status(200).json({
            success: true,
            data: formattedLibrary,
        });
    }
    catch (error) {
        console.error('Error fetching library:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch library details',
        });
    }
};
export const registerLibrary = async (req, res) => {
    try {
        const { name, description, address, city, state, country, postalCode, email, phone, images, amenities, totalSeats, additionalInformation, adminBio, adminCompleteAddress, adminPhone, adminGovernmentId, adminPhoto, openingHours, adminId, userEmail, userName } = req.body;
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
            return;
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
    }
    catch (error) {
        console.error('Error registering library:', error);
        // Handle specific error for existing admin
        if (error instanceof Error && error === 'User is already an admin of another library') {
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
};
export const getLibraryRequests = async (_req, res) => {
    // console.log("USer role:", req.user?.role)
    try {
        const libraries = await prisma.library.findMany({
            where: {
                status: 'PENDING',
                isActive: false,
            },
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
                amenities: true,
                totalSeats: true,
                additinalInformation: true, // Note: matches schema typo
                AdminBio: true,
                AdminCompleteAddress: true,
                AdminPhone: true,
                AdminGovernmentId: true,
                AdminPhoto: true,
                createdAt: true,
                admin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        auth0UserId: true,
                        role: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            message: 'Library requests fetched successfully',
            data: libraries,
        });
    }
    catch (error) {
        console.error('Error fetching library requests:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch library requests',
        });
    }
};
export const approvLibrary = async (req, res) => {
    const { libraryId: id } = req.params;
    const role = req.user?.role;
    if (role !== 'SUPER_ADMIN') {
        res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'You do not have permission to approve libraries',
        });
        return;
    }
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'User ID is required',
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Library ID is required',
        });
        return;
    }
    try {
        const library = await prisma.library.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                adminId: true,
                status: true,
                isActive: true,
            },
        });
        if (!library) {
            res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Library not found',
            });
            return;
        }
        if (library.status !== 'PENDING') {
            res.status(400).json({
                success: false,
                error: 'Invalid status',
                message: 'Library is not in pending status',
            });
            return;
        }
        const update = prisma.$transaction(async (tx) => {
            // Update library status to APPROVED and activate it
            const updatedLibrary = await tx.library.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    isActive: true,
                },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    isActive: true,
                    adminId: true,
                },
            });
            // Update admin role to ADMIN
            await tx.user.update({
                where: { id: updatedLibrary.adminId },
                data: { role: 'ADMIN' },
            });
            return updatedLibrary;
        });
        const updatedLibrary = await update;
        if (!updatedLibrary) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to update library status',
            });
            return;
        }
        // Return success response
        if (!updatedLibrary.isActive) {
            res.status(400).json({
                success: false,
                error: 'Library not active',
                message: 'Library is not active after approval',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Library approved successfully',
            data: updatedLibrary,
        });
    }
    catch (error) {
        console.error('Error approving library:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to approve library',
        });
    }
};
export const rejectLibrary = async (req, res) => {
    const { libraryId } = req.params;
    const role = req.user?.role;
    if (role !== 'SUPER_ADMIN') {
        res.status(403).json({
            success: false,
            error: 'Forbidden',
            message: 'You do not have permission to reject libraries',
        });
        return;
    }
    try {
        const library = await prisma.library.findUnique({
            where: { id: libraryId },
            select: {
                id: true,
                name: true,
                adminId: true,
                status: true,
            },
        });
        if (!library) {
            res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Library not found',
            });
            return;
        }
        if (library.status !== 'PENDING') {
            res.status(400).json({
                success: false,
                error: 'Invalid status',
                message: `Library is in ${library.status} status`,
            });
            return;
        }
        // Update library status to REJECTED
        const updatedLibrary = await prisma.library.update({
            where: { id: libraryId },
            data: {
                status: 'REJECTED',
                isActive: false, // Deactivate the library
            },
        });
        res.status(200).json({
            success: true,
            message: 'Library rejected successfully',
            data: updatedLibrary,
        });
    }
    catch (error) {
        console.error('Error rejecting library:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to reject library',
        });
    }
};
// export const deleteMembershipPlan = async (req: Request, res: Response) => {
//   const { planId } = req.params;
//   const { id : userId } = req.user.id
//   try {
//     // Check if the membership plan exists
//     const membershipPlan = await prisma.membershipPlan.findUnique({
//       where: { id: planId },
//       select: {
//         id: true,
//         libraryId: true,
//         isActive: true,
//         library: {
//           select: {
//             adminId: true,
//           },
//         },
//       },
//     });
//     if (!membershipPlan) {
//       return res.status(404).json({
//         success: false,
//         error: 'Not found',
//         message: 'Membership plan not found',
//       });
//     }
//     // Check if the user is the admin of the library
//     if (membershipPlan.library.adminId !== userId) {
//       return res.status(403).json({
//         success: false,
//         error: 'Forbidden',
//         message: 'You are not authorized to delete this membership plan',
//       });
//     }
//     // Delete the membership plan
//     await prisma.membershipPlan.delete({
//       where: { id: planId },
//     });
//     res.status(200).json({
//       success: true,
//       message: 'Membership plan deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting membership plan:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//       message: 'Failed to delete membership plan',
//     });
//   }
// };
export const getTopLibraries = async (_req, res) => {
    // This function should be called on a route like GET /api/libraries/top
    // Make sure it's not conflicting with GET /api/libraries/:id routes
    try {
        // Fetch libraries with their seat bookings, payments, and members
        const libraries = await prisma.library.findMany({
            where: {
                isActive: true,
                status: 'APPROVED', // Only include approved libraries
            },
            include: {
                seatBookings: {
                    include: {
                        payment: {
                            select: {
                                amount: true,
                                status: true,
                                currency: true,
                            },
                        },
                    },
                    where: {
                        status: {
                            in: ['CONFIRMED', 'COMPLETED'], // Only count confirmed/completed bookings
                        },
                    },
                },
                members: {
                    select: {
                        id: true, // Only select ID to minimize data transfer
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        });
        // Calculate revenue and prepare library data
        const topLibraries = libraries
            .map((library) => {
            // Calculate total revenue from completed payments
            const totalRevenue = library.seatBookings.reduce((sum, booking) => {
                const paymentAmount = booking.payment?.status === 'COMPLETED'
                    ? booking.payment.amount
                    : 0;
                return sum + paymentAmount;
            }, 0);
            return {
                id: library.id,
                name: library.name,
                location: `${library.city}, ${library.state}`,
                address: library.address,
                revenue: totalRevenue,
                currency: 'INR', // Default currency from schema
                memberCount: library.members.length,
                totalBookings: library.seatBookings.length,
                reviewCount: library._count.reviews,
                rating: library.rating,
            };
        })
            // Sort by revenue in descending order
            .sort((a, b) => b.revenue - a.revenue)
            // Get top 10 libraries
            .slice(0, 5);
        // Return successful response
        res.status(200).json({
            success: true,
            message: 'Top libraries fetched successfully',
            data: {
                libraries: topLibraries,
                total: topLibraries.length,
                timestamp: new Date().toISOString(),
            },
        });
    }
    catch (error) {
        console.error('Error fetching top libraries:', error);
        // Handle specific Prisma errors
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to fetch top libraries',
                details: process.env.NODE_ENV === 'development' ? error : undefined,
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Unknown error occurred',
                message: 'Failed to fetch top libraries',
            });
        }
    }
};
// Get library members with pagination and search
export const getLibraryMembers = async (req, res) => {
    try {
        const { libraryId } = req.params;
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Validate library exists and user has access
        const library = await prisma.library.findFirst({
            where: {
                id: libraryId,
                isActive: true,
                status: 'APPROVED',
            },
        });
        if (!library) {
            res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Library not found or not approved',
            });
            return;
        }
        // Build search filter
        const searchFilter = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ],
        } : {};
        // Get total count for pagination
        const totalCount = await prisma.user.count({
            where: {
                registeredLibraryIds: {
                    has: libraryId,
                },
                ...searchFilter,
            },
        });
        // Get members with their membership details
        const members = await prisma.user.findMany({
            where: {
                registeredLibraryIds: {
                    has: libraryId,
                },
                ...searchFilter,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                createdAt: true,
                memberships: {
                    where: {
                        library: {
                            id: libraryId,
                        },
                    },
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        autoRenew: true,
                        membershipPlan: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                duration: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1, // Get the latest membership
                },
                _count: {
                    select: {
                        seatBookings: {
                            where: {
                                libraryId: libraryId,
                            },
                        },
                    },
                },
            },
            skip,
            take: Number(limit),
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPages = Math.ceil(totalCount / Number(limit));
        res.status(200).json({
            success: true,
            data: {
                members: members.map((member) => ({
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    phone: member.phone,
                    avatar: member.avatar,
                    joinedAt: member.createdAt,
                    membership: member.memberships[0] || null,
                    totalBookings: member._count.seatBookings,
                })),
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalCount,
                    hasNextPage: Number(page) < totalPages,
                    hasPreviousPage: Number(page) > 1,
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching library members:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch library members',
        });
    }
};
// Get library bookings with pagination and filtering
export const getLibraryBookings = async (req, res) => {
    try {
        const { libraryId } = req.params;
        const { page = 1, limit = 10, status = '', search = '', startDate = '', endDate = '', } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Validate library exists
        const library = await prisma.library.findFirst({
            where: {
                id: libraryId,
                isActive: true,
                status: 'APPROVED',
            },
        });
        if (!library) {
            res.status(404).json({
                success: false,
                error: 'Not found',
                message: 'Library not found or not approved',
            });
            return;
        }
        // Build filters
        const filters = {
            libraryId: libraryId,
        };
        if (status) {
            filters.status = status;
        }
        if (startDate && endDate) {
            filters.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (search) {
            filters.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { seat: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }
        // Get total count for pagination
        const totalCount = await prisma.seatBooking.count({
            where: filters,
        });
        // Get bookings with related data
        const bookings = await prisma.seatBooking.findMany({
            where: filters,
            select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                duration: true,
                bookingPrice: true,
                currency: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                seat: {
                    select: {
                        id: true,
                        name: true,
                        seatType: true,
                        floor: true,
                        section: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        transactionId: true,
                    },
                },
            },
            skip,
            take: Number(limit),
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPages = Math.ceil(totalCount / Number(limit));
        // Calculate summary statistics
        const todayBookings = await prisma.seatBooking.count({
            where: {
                libraryId: libraryId,
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
        });
        const totalRevenue = await prisma.seatBooking.aggregate({
            where: {
                libraryId: libraryId,
                status: { in: ['CONFIRMED', 'COMPLETED'] },
            },
            _sum: {
                bookingPrice: true,
            },
        });
        res.status(200).json({
            success: true,
            data: {
                bookings,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalCount,
                    hasNextPage: Number(page) < totalPages,
                    hasPreviousPage: Number(page) > 1,
                },
                summary: {
                    todayBookings,
                    totalRevenue: totalRevenue._sum.bookingPrice || 0,
                    totalBookings: totalCount,
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching library bookings:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch library bookings',
        });
    }
};
//# sourceMappingURL=libraryController.js.map