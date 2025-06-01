"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemberDashboard = exports.getAdminDashboard = exports.getSuperAdminDashboard = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const prisma_2 = require("../../generated/prisma");
const getSuperAdminDashboard = async (_req, res) => {
    try {
        // Totals
        const [totalLibraries, totalMembers] = await Promise.all([
            prisma_1.default.library.count(),
            prisma_1.default.user.count({ where: { role: 'MEMBER' } }),
        ]);
        // Monthly revenue (from 1st day of current month)
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthlyRevenueResult = await prisma_1.default.payment.aggregate({
            _sum: { amount: true },
            where: { createdAt: { gte: startOfMonth } },
        });
        const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
        // Revenue breakdown by payment type using enum
        const paymentTypes = [
            prisma_2.PaymentType.MEMBERSHIP,
            prisma_2.PaymentType.SEAT_BOOKING,
            prisma_2.PaymentType.PENALTY,
            prisma_2.PaymentType.EBOOK_PURCHASE,
            prisma_2.PaymentType.OTHER,
        ];
        const revenueBreakdown = {
            [prisma_2.PaymentType.MEMBERSHIP]: 0,
            [prisma_2.PaymentType.SEAT_BOOKING]: 0,
            [prisma_2.PaymentType.PENALTY]: 0,
            [prisma_2.PaymentType.EBOOK_PURCHASE]: 0,
            [prisma_2.PaymentType.OTHER]: 0,
        };
        const revenueResults = await Promise.all(paymentTypes.map((type) => prisma_1.default.payment.aggregate({
            _sum: { amount: true },
            where: { type },
        })));
        paymentTypes.forEach((type, idx) => {
            revenueBreakdown[type] = revenueResults[idx]._sum.amount ?? 0;
        });
        const totalRevenue = Object.values(revenueBreakdown).reduce((a, b) => a + b, 0);
        // Top libraries based on seat booking payments
        const libraries = await prisma_1.default.library.findMany({
            include: {
                seatBookings: {
                    include: {
                        payment: true,
                    },
                },
                members: true,
            },
        });
        const topLibraries = libraries
            .map((lib) => {
            const libRevenue = (lib.seatBookings ?? []).reduce((sum, booking) => {
                return sum + (booking.payment?.amount ?? 0);
            }, 0);
            return {
                name: lib.name,
                location: `${lib.city}, ${lib.state}`, // or lib.address if you prefer
                revenue: libRevenue,
                members: lib.members?.length ?? 0, // use members, not users
            };
        })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4);
        res.status(200).json({
            success: true,
            data: {
                totalLibraries,
                totalMembers,
                monthlyRevenue,
                totalRevenue,
                revenueBreakdown,
                topLibraries,
            },
        });
    }
    catch (error) {
        console.error('Super Admin Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch super admin dashboard stats',
            error: error.message,
        });
    }
};
exports.getSuperAdminDashboard = getSuperAdminDashboard;
/**
 * @route GET /api/dashboard/admin
 * @desc Get admin dashboard stats from database
 * @access Private (Admin)
 */
const getAdminDashboard = async (req, res) => {
    try {
        const libraryId = req.libraryId;
        const role = req.role;
        if (!libraryId || role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
            // console.log(libraryId);
            // console.log(role);
            // console.log(req.user)
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const [todayBookings, activeMembers, revenueResult, checkedOutBooks, totalSeats, totalBooks, availableBooks,] = await Promise.all([
            prisma_1.default.seatBooking.count({
                where: {
                    libraryId,
                    date: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            }),
            prisma_1.default.user.count({
                where: {
                    role: 'MEMBER',
                    memberships: {
                        some: {
                            libraryId: libraryId,
                        },
                    },
                },
            }),
            prisma_1.default.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    createdAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                    membership: {
                        libraryId: libraryId,
                    },
                },
            }),
            prisma_1.default.eBook.count({
                where: {
                    libraryId,
                    status: 'CHECKED_OUT',
                },
            }),
            prisma_1.default.seat.count({
                where: { libraryId },
            }),
            prisma_1.default.eBook.count({
                where: { libraryId },
            }),
            prisma_1.default.eBook.count({
                where: {
                    libraryId,
                    status: 'AVAILABLE',
                },
            }),
        ]);
        const occupancyRate = {
            current: todayBookings,
            total: totalSeats,
            percentage: totalSeats ? Math.floor((todayBookings / totalSeats) * 100) : 0,
        };
        const inventoryStatus = {
            total: totalBooks,
            available: availableBooks,
            checkedOut: checkedOutBooks,
        };
        res.status(200).json({
            success: true,
            data: {
                todayBookings,
                activeMembers,
                todayRevenue: revenueResult._sum.amount ?? 0,
                occupancyRate,
                inventoryStatus,
            },
        });
        return;
    }
    catch (error) {
        console.error('Admin Dashboard Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch admin dashboard stats',
            error: error.message,
        });
        return;
    }
};
exports.getAdminDashboard = getAdminDashboard;
/**
 * @desc Get member dashboard stats
 * @route GET /api/dashboard/member
 * @access Private (Member only)
 */
const getMemberDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const [upcomingBookings, booksReadCount, readingHistory] = await Promise.all([
            prisma_1.default.seatBooking.findMany({
                where: {
                    userId,
                    date: {
                        gte: new Date(),
                    },
                },
                orderBy: { date: 'asc' },
                take: 1,
            }),
            prisma_1.default.readingHistory.count({
                where: {
                    userId,
                    isCompleted: true,
                },
            }),
            prisma_1.default.readingHistory.findMany({
                where: {
                    userId,
                    isCompleted: false,
                },
                include: {
                    eBook: true,
                },
                orderBy: { updatedAt: 'desc' },
                take: 3,
            }),
        ]);
        const totalStudyHours = user.totalStudyHours ?? 0;
        const streak = user.streak ?? 0;
        const quizzes = user.quizzesTaken ?? 0;
        const currentlyReading = readingHistory.map((log) => ({
            title: log.eBook?.title ?? 'Unknown',
            progress: Math.floor((log.lastReadPage / log.totalPages) * 100),
            page: log.lastReadPage,
            total: log.totalPages,
        }));
        res.status(200).json({
            success: true,
            data: {
                streak,
                studyHours: totalStudyHours,
                upcomingBookings: upcomingBookings.length,
                booksRead: booksReadCount,
                nextBooking: upcomingBookings[0]
                    ? `${new Date(upcomingBookings[0].date).toDateString()}, ${upcomingBookings[0].startTime} - ${upcomingBookings[0].endTime}`
                    : 'No upcoming booking',
                currentlyReading,
                studyGoals: {
                    readBooks: {
                        current: booksReadCount,
                        target: 10,
                        percentage: Math.min(100, Math.floor((booksReadCount / 10) * 100)),
                    },
                    studyHours: {
                        current: totalStudyHours,
                        target: 40,
                        percentage: Math.min(100, Math.floor((totalStudyHours / 40) * 100)),
                    },
                    quizzes: {
                        current: quizzes,
                        target: 5,
                        percentage: Math.min(100, Math.floor((quizzes / 5) * 100)),
                    },
                },
            },
        });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch member dashboard stats',
            error: error.message,
        });
    }
};
exports.getMemberDashboard = getMemberDashboard;
//# sourceMappingURL=dashboardController.js.map