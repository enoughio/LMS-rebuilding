import prisma from '../lib/prisma.js';
// Get library profile for admin
export const getLibraryProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'User not authenticated',
            });
            return;
        }
        // Check if user is an admin and get their library
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                adminOf: true
            }
        });
        if (!user || user.role !== 'ADMIN' || !user.adminOf) {
            res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'User is not a library admin',
            });
            return;
        }
        const libraryId = user.adminOf.id; // Get library with all related data
        const library = await prisma.library.findUnique({
            where: { id: libraryId },
            include: {
                openingHours: {
                    orderBy: { dayOfWeek: 'asc' },
                },
                membershipPlans: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        duration: true,
                        features: true,
                        allowedBookingsPerMonth: true,
                        eLibraryAccess: true,
                    },
                },
                seats: {
                    select: {
                        isAvailable: true,
                        isActive: true,
                    },
                    where: { isActive: true },
                },
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
        // Calculate available seats
        const availableSeats = library.seats.filter(seat => seat.isAvailable).length;
        // Transform opening hours to match frontend format
        const openingHours = {};
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        library.openingHours.forEach((hour) => {
            const dayName = dayNames[hour.dayOfWeek];
            openingHours[dayName] = {
                open: hour.isClosed ? 'closed' : hour.openTime,
                close: hour.isClosed ? 'closed' : hour.closeTime,
            };
        });
        // Format response to match frontend expectations
        const response = {
            id: library.id,
            name: library.name,
            description: library.description,
            address: library.address,
            images: library.images || [],
            rating: library.rating || 0,
            reviewCount: library.reviewCount || 0,
            amenities: library.amenities || [],
            openingHours,
            ownerId: library.adminId,
            membershipPlans: library.membershipPlans,
            totalSeats: library.totalSeats,
            availableSeats,
        };
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error('Error fetching library profile:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch library profile',
        });
    }
};
// Update library profile for admin
export const updateLibraryProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'User not authenticated',
            });
            return;
        }
        // Check if user is an admin and get their library
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                adminOf: true
            }
        });
        if (!user || user.role !== 'ADMIN' || !user.adminOf) {
            res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'User is not a library admin',
            });
            return;
        }
        const libraryId = user.adminOf.id;
        const { name, description, address, amenities, totalSeats, images, openingHours, } = req.body;
        // Start transaction to update library and opening hours
        const updatedLibrary = await prisma.$transaction(async (tx) => {
            // Update library basic information
            const library = await tx.library.update({
                where: { id: libraryId },
                data: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(address && { address }),
                    ...(amenities && { amenities }),
                    ...(totalSeats && { totalSeats: parseInt(totalSeats) }),
                    ...(images && { images }),
                },
            });
            // Update opening hours if provided
            if (openingHours) {
                const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                for (const [dayName, hours] of Object.entries(openingHours)) {
                    const dayOfWeek = dayNames.indexOf(dayName);
                    if (dayOfWeek !== -1 && typeof hours === 'object' && hours !== null) {
                        const { open, close } = hours;
                        const isClosed = open === 'closed' || close === 'closed';
                        await tx.openingHour.upsert({
                            where: {
                                libraryId_dayOfWeek: {
                                    libraryId,
                                    dayOfWeek,
                                },
                            },
                            update: {
                                openTime: isClosed ? '00:00' : open,
                                closeTime: isClosed ? '00:00' : close,
                                isClosed,
                            },
                            create: {
                                libraryId,
                                dayOfWeek,
                                openTime: isClosed ? '00:00' : open,
                                closeTime: isClosed ? '00:00' : close,
                                isClosed,
                            },
                        });
                    }
                }
            }
            return library;
        });
        res.status(200).json({
            success: true,
            data: updatedLibrary,
            message: 'Library profile updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating library profile:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to update library profile',
        });
    }
};
//# sourceMappingURL=libraryProfileController.js.map