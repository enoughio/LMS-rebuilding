import prisma from '../lib/prisma.js';
export const getAdminDashboardData = async (req, res) => {
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
                adminOf: {
                    select: { id: true }
                }
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
        // Get today's date range
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        // Get yesterday's date range for comparison
        const yesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
        // Get this week's date range
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        // Get last week's date range for comparison
        const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
        const endOfLastWeek = new Date(startOfWeek.getTime() - 1);
        // Today's bookings
        const todaysBookings = await prisma.seatBooking.count({
            where: {
                libraryId,
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
        });
        // Yesterday's bookings for comparison
        const yesterdaysBookings = await prisma.seatBooking.count({
            where: {
                libraryId,
                date: {
                    gte: startOfYesterday,
                    lte: endOfYesterday,
                },
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
        });
        // Active members (members with active memberships)
        const activeMembers = await prisma.membership.count({
            where: {
                libraryId,
                status: 'ACTIVE',
                endDate: {
                    gte: new Date(),
                },
            },
        });
        // Last week's active members for comparison
        const lastWeekActiveMembers = await prisma.membership.count({
            where: {
                libraryId,
                status: 'ACTIVE',
                endDate: {
                    gte: startOfLastWeek,
                    lte: endOfLastWeek,
                },
            },
        });
        // Today's revenue from seat bookings
        const todaysRevenue = await prisma.seatBooking.aggregate({
            where: {
                libraryId,
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
            _sum: {
                bookingPrice: true,
            },
        });
        // Yesterday's revenue for comparison
        const yesterdaysRevenue = await prisma.seatBooking.aggregate({
            where: {
                libraryId,
                date: {
                    gte: startOfYesterday,
                    lte: endOfYesterday,
                },
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
            _sum: {
                bookingPrice: true,
            },
        });
        // Books checked out (assuming we're counting borrowed books)
        const booksCheckedOut = await prisma.bookBorrowing.count({
            where: {
                libraryId,
                status: 'BORROWED',
            },
        });
        // Yesterday's books checked out for comparison
        const yesterdaysBooksCheckedOut = await prisma.bookBorrowing.count({
            where: {
                libraryId,
                status: 'BORROWED',
                borrowDate: {
                    gte: startOfYesterday,
                    lte: endOfYesterday,
                },
            },
        });
        // Get recent activity (recent bookings)
        const recentBookings = await prisma.seatBooking.findMany({
            where: {
                libraryId,
                status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                seat: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        // Current occupancy (today's active bookings)
        const currentOccupancy = await prisma.seatBooking.count({
            where: {
                libraryId,
                date: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: 'CONFIRMED',
            },
        });
        // Total seats in library
        const totalSeats = await prisma.seat.count({
            where: {
                libraryId,
                isActive: true,
            },
        });
        // Book inventory stats
        const bookInventory = await prisma.physicalBook.groupBy({
            by: ['status'],
            where: {
                libraryId,
            },
            _count: {
                status: true,
            },
        });
        const totalBooks = await prisma.physicalBook.count({
            where: { libraryId },
        });
        const availableBooks = bookInventory.find((b) => b.status === 'AVAILABLE')?._count.status || 0;
        const borrowedBooks = bookInventory.find((b) => b.status === 'BORROWED')?._count.status || 0; // Book categories
        const bookCategories = await prisma.physicalBook.groupBy({
            by: ['categoryId'],
            where: {
                libraryId,
            },
            _count: {
                categoryId: true,
            },
            orderBy: {
                _count: {
                    categoryId: 'desc',
                },
            },
            take: 5,
        }); // Get category names
        const categoryIds = bookCategories.map((c) => c.categoryId);
        const categories = await prisma.bookCategory.findMany({
            where: {
                id: { in: categoryIds },
            },
            select: {
                id: true,
                name: true,
            },
        });
        const categoriesWithCounts = bookCategories.map((bc) => {
            const category = categories.find((c) => c.id === bc.categoryId);
            return {
                name: category?.name || 'Unknown',
                count: bc._count.categoryId,
            };
        });
        // Format response data
        const dashboardData = {
            todaysBookings: {
                count: todaysBookings,
                change: todaysBookings - yesterdaysBookings,
                comparedTo: "yesterday",
            },
            activeMembers: {
                count: activeMembers,
                change: activeMembers - lastWeekActiveMembers,
                comparedTo: "this week",
            },
            todaysRevenue: {
                amount: Math.round(todaysRevenue._sum.bookingPrice || 0),
                change: Math.round((todaysRevenue._sum.bookingPrice || 0) - (yesterdaysRevenue._sum.bookingPrice || 0)),
                comparedTo: "yesterday",
            },
            booksCheckedOut: {
                count: booksCheckedOut,
                change: booksCheckedOut - yesterdaysBooksCheckedOut,
                comparedTo: "yesterday",
            },
            occupancyRate: {
                current: currentOccupancy,
                total: totalSeats,
            },
            inventory: {
                totalBooks,
                available: availableBooks,
                checkedOut: borrowedBooks,
                categories: categoriesWithCounts,
            }, recentActivity: recentBookings.map((booking) => ({
                type: "booking",
                userName: booking.user.name,
                time: new Date(booking.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                seatName: booking.seat.name,
                id: booking.id,
                avatar: booking.user.avatar,
            })),
        };
        res.status(200).json({
            success: true,
            data: dashboardData,
        });
    }
    catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch dashboard data',
        });
    }
};
//# sourceMappingURL=adminDashboardController.js.map