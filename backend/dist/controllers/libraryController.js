import prisma from "../lib/prisma.js";
// export const getAllLibraries = async (req: Request, res: Response) => {
//     let filter
//     const page = Math.max(1, parseInt(req.query.page as string) || 1); // Default to page 1 if not provided
//     const limit = Math.max(1, parseInt(req.query.limit as string) || 10); // Default to 10 items per page
//     const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination
//     const search = req.query.search as string || "";
//     const city = req.query.city as string || "";
//     try {
//         let filter: any = {}; // Initialize filter as an empty object
//         filter = {
//             isApproved: true, // Only fetch approved libraries
//             OR: [
//                 {
//                     name: {
//                         contains: search,
//                         mode: "insensitive", // Case-insensitive search
//                     },
//                 },
//                 {
//                     location: {
//                         contains: search,
//                         mode: "insensitive", // Case-insensitive search
//                     },
//                 },
//             ],
//         };
//         if (city) {
//             filter = {
//                 ...filter,
//                 city: {
//                     contains: city,
//                     mode: "insensitive", // Case-insensitive search for city
//                 },
//             };
//         }
//         const libraries = await prisma.library.findMany({
//             where: {
//                 ...filter,
//             },
//             select : {
//                 id: true,
//                 name: true,
//                 address: true,
//                 city: true,
//                 description: true,
//                 images: true,
//                 createdAt: true,
//                 rating: true,
//                 amenities: true,
//                 openingHours: true,
//                 seats : {
//                     select: {
//                     }
//                 }
//             }
//         })
//     } catch (error) {
//         console.error("Error fetching libraries:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }
export const getAllLibraries = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Default to page 1 if not provided
    const limit = Math.max(1, parseInt(req.query.limit) || 10); // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of items to skip for pagination
    const search = req.query.search || "";
    const city = req.query.city || "";
    try {
        let filter = {
            status: "APPROVED", // Based on your schema, it should be 'status' not 'isApproved'
            isActive: true, // Only fetch active libraries
        };
        // Add search filter if search term is provided
        if (search) {
            filter.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive", // Case-insensitive search
                    },
                },
                {
                    address: {
                        contains: search,
                        mode: "insensitive", // Case-insensitive search
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive", // Case-insensitive search
                    },
                },
            ];
        }
        // Add city filter if city is provided
        if (city) {
            filter.city = {
                contains: city,
                mode: "insensitive", // Case-insensitive search for city
            };
        }
        // Get total count for pagination
        const totalCount = await prisma.library.count({
            where: filter,
        });
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
                    orderBy: {
                        dayOfWeek: 'asc',
                    },
                },
                _count: {
                    select: {
                        seats: {
                            where: {
                                isActive: true,
                                isAvailable: true
                            }
                        }
                    }
                },
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
        // Transform the data to include available seat counts by type
        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            success: true,
            data: {
                libraries: libraries.map(library => ({
                    ...library,
                    availableSeats: library._count.seats
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                }
            }
        });
    }
    catch (error) {
        console.error("Error fetching libraries:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "Failed to fetch libraries"
        });
    }
};
// export const getLibraryById = async (req: Request, res: Response) => {
//# sourceMappingURL=libraryController.js.map