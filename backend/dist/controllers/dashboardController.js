import prisma from '../lib/prisma.js';
import { PaymentType } from '../../generated/prisma/index.js';
// export const getSuperAdminDashboard = async (_req: Request, res: Response) => {
//   try {
//     // Totals
//     const [totalLibraries, totalMembers] = await Promise.all([
//       prisma.library.count(),
//       prisma.user.count({ where: { role: 'MEMBER' } }),
//     ]);
//     // Monthly revenue (from 1st day of current month)
//     const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     const monthlyRevenueResult = await prisma.payment.aggregate({
//       _sum: { amount: true },
//       where: { createdAt: { gte: startOfMonth } },
//     });
//     const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
//     // Revenue breakdown by payment type using enum
//     const paymentTypes = [
//       PaymentType.MEMBERSHIP,
//       PaymentType.SEAT_BOOKING,
//       PaymentType.PENALTY,
//       PaymentType.EBOOK_PURCHASE,
//       PaymentType.OTHER,
//     ];
//     const revenueBreakdown: Record<PaymentType, number> = {
//       [PaymentType.MEMBERSHIP]: 0,
//       [PaymentType.SEAT_BOOKING]: 0,
//       [PaymentType.PENALTY]: 0,
//       [PaymentType.EBOOK_PURCHASE]: 0,
//       [PaymentType.OTHER]: 0,
//     };
//     const revenueResults = await Promise.all(
//       paymentTypes.map((type) =>
//         prisma.payment.aggregate({
//           _sum: { amount: true },
//           where: { type },
//         })
//       )
//     );
//     paymentTypes.forEach((type, idx) => {
//       revenueBreakdown[type] = revenueResults[idx]._sum.amount ?? 0;
//     });
//     const totalRevenue = Object.values(revenueBreakdown).reduce((a, b) => a + b, 0);
//     res.status(200).json({
//       success: true,
//       data: {
//         totalLibraries,
//         totalMembers,
//         monthlyRevenue,
//         totalRevenue,
//         revenueBreakdown,
//       },
//     });
//   } catch (error: any) {
//     console.error('Super Admin Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch super admin dashboard stats',
//       error: error.message,
//     });
//   }
// };
// export const getRevenue = async (req: Request): Promise<void> => {
//     try {
//     } catch (error) {
//     }
// }
export const getSuperAdminDashboard = async (_req, res) => {
    try {
        // Date calculations
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        // const startOfYear = new Date(now.getFullYear(), 0, 1);
        // Platform Stats
        const [totalLibraries, totalMembers, totalLibrariesLastMonth, totalMembersLastMonth, monthlyRevenueResult, lastMonthRevenueResult, allPayments] = await Promise.all([
            // Current totals
            prisma.library.count({ where: { status: 'APPROVED' } }),
            prisma.user.count({ where: { role: 'MEMBER' } }),
            // Last month totals for comparison
            prisma.library.count({
                where: {
                    status: 'APPROVED',
                    createdAt: { lt: startOfMonth }
                }
            }),
            prisma.user.count({
                where: {
                    role: 'MEMBER',
                    createdAt: { lt: startOfMonth }
                }
            }),
            // Monthly revenue
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: startOfMonth }
                },
            }),
            // Last month revenue for comparison
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: lastMonth,
                        lte: endOfLastMonth
                    }
                },
            }),
            // All completed payments for breakdown
            prisma.payment.findMany({
                where: { status: 'COMPLETED' },
                select: {
                    amount: true,
                    type: true,
                    createdAt: true
                }
            })
        ]);
        const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
        const lastMonthRevenue = lastMonthRevenueResult._sum.amount ?? 0;
        // Calculate changes
        const libraryChange = totalLibraries - totalLibrariesLastMonth;
        const memberChange = totalMembers - totalMembersLastMonth;
        const revenueChangePercent = lastMonthRevenue > 0
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
            : 0;
        // Revenue breakdown by payment type
        const revenueBreakdown = {
            membershipFees: 0,
            seatBookings: 0,
            otherServices: 0,
            platformCommission: 0
        };
        let totalRevenue = 0;
        allPayments.forEach(payment => {
            totalRevenue += payment.amount;
            switch (payment.type) {
                case PaymentType.MEMBERSHIP:
                    revenueBreakdown.membershipFees += payment.amount;
                    break;
                case PaymentType.SEAT_BOOKING:
                    revenueBreakdown.seatBookings += payment.amount;
                    break;
                case PaymentType.PENALTY:
                case PaymentType.EBOOK_PURCHASE:
                case PaymentType.OTHER:
                    revenueBreakdown.otherServices += payment.amount;
                    break;
            }
        });
        // Calculate platform commission (assuming 20% of total revenue)
        revenueBreakdown.platformCommission = totalRevenue * 0.20;
        // Calculate percentages for revenue breakdown
        const revenueBreakdownWithPercentages = {
            membershipFees: {
                amount: revenueBreakdown.membershipFees,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.membershipFees / totalRevenue) * 100) : 0
            },
            seatBookings: {
                amount: revenueBreakdown.seatBookings,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.seatBookings / totalRevenue) * 100) : 0
            },
            otherServices: {
                amount: revenueBreakdown.otherServices,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.otherServices / totalRevenue) * 100) : 0
            },
            platformCommission: {
                amount: revenueBreakdown.platformCommission,
                percentage: 20
            }
        };
        // Platform growth data (monthly for past 12 months)
        const growthData = [];
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const [libraryCount, memberCount, revenue] = await Promise.all([
                prisma.library.count({
                    where: {
                        status: 'APPROVED',
                        createdAt: { lte: monthEnd }
                    }
                }),
                prisma.user.count({
                    where: {
                        role: 'MEMBER',
                        createdAt: { lte: monthEnd }
                    }
                }),
                prisma.payment.aggregate({
                    _sum: { amount: true },
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    }
                })
            ]);
            growthData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                libraries: libraryCount,
                members: memberCount,
                revenue: revenue._sum.amount ?? 0
            });
        }
        // Platform health (simple uptime calculation - you can make this more sophisticated)
        const platformHealth = 99.8; // You can calculate this based on your monitoring data
        res.status(200).json({
            success: true,
            data: {
                platformStats: {
                    totalLibraries: {
                        count: totalLibraries,
                        change: libraryChange,
                        period: "this month"
                    },
                    totalMembers: {
                        count: totalMembers,
                        change: memberChange,
                        period: "this month"
                    },
                    monthlyRevenue: {
                        amount: monthlyRevenue,
                        change: Number(revenueChangePercent.toFixed(1)),
                        period: "last month"
                    },
                    platformHealth: {
                        percentage: platformHealth,
                        uptime: "this month"
                    }
                },
                revenueBreakdown: revenueBreakdownWithPercentages,
                platformGrowth: growthData,
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
export const getStatsController = async (_req, res) => {
    try {
        // Date calculations
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Platform Stats
        const [totalLibraries, totalMembers, totalLibrariesLastMonth, totalMembersLastMonth, monthlyRevenueResult] = await Promise.all([
            // Current totals
            prisma.library.count({ where: { status: 'APPROVED' } }),
            prisma.user.count({ where: { role: 'MEMBER' } }),
            // Last month totals for comparison
            prisma.library.count({
                where: {
                    status: 'APPROVED',
                    createdAt: { lt: startOfMonth }
                }
            }),
            prisma.user.count({
                where: {
                    role: 'MEMBER',
                    createdAt: { lt: startOfMonth }
                }
            }),
            // Monthly revenue
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: startOfMonth }
                }
            })
        ]);
        // Calculate changes
        const libraryChange = totalLibraries - totalLibrariesLastMonth;
        const memberChange = totalMembers - totalMembersLastMonth;
        const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
        // Platform health (simple uptime calculation - you can make this more sophisticated)
        const platformHealth = 99.8; // You can calculate this based on your monitoring data
        res.status(200).json({
            success: true,
            data: {
                platformStats: {
                    totalLibraries: {
                        count: totalLibraries,
                        change: libraryChange,
                        period: "this month"
                    },
                    totalMembers: {
                        count: totalMembers,
                        change: memberChange,
                        period: "this month"
                    },
                    monthlyRevenue: {
                        amount: monthlyRevenue,
                        period: "this month"
                    },
                    platformHealth: {
                        percentage: platformHealth,
                        uptime: "this month"
                    }
                }
            },
        });
    }
    catch (error) {
        console.error('Stats Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch platform stats',
            error: error.message,
        });
    }
};
// ==========================================
// 2. REVENUE CONTROLLER
// ==========================================
export const getRevenueController = async (_req, res) => {
    try {
        // Date calculations
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const [monthlyRevenueResult, lastMonthRevenueResult, allPayments] = await Promise.all([
            // Monthly revenue
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: { gte: startOfMonth }
                },
            }),
            // Last month revenue for comparison
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: lastMonth,
                        lte: endOfLastMonth
                    }
                },
            }),
            // All completed payments for breakdown
            prisma.payment.findMany({
                where: { status: 'COMPLETED' },
                select: {
                    amount: true,
                    type: true,
                    createdAt: true
                }
            })
        ]);
        const monthlyRevenue = monthlyRevenueResult._sum.amount ?? 0;
        const lastMonthRevenue = lastMonthRevenueResult._sum.amount ?? 0;
        // Calculate revenue change percentage
        const revenueChangePercent = lastMonthRevenue > 0
            ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
            : 0;
        // Revenue breakdown by payment type
        const revenueBreakdown = {
            membershipFees: 0,
            seatBookings: 0,
            otherServices: 0,
            platformCommission: 0
        };
        let totalRevenue = 0;
        allPayments.forEach(payment => {
            totalRevenue += payment.amount;
            switch (payment.type) {
                case PaymentType.MEMBERSHIP:
                    revenueBreakdown.membershipFees += payment.amount;
                    break;
                case PaymentType.SEAT_BOOKING:
                    revenueBreakdown.seatBookings += payment.amount;
                    break;
                case PaymentType.PENALTY:
                case PaymentType.EBOOK_PURCHASE:
                case PaymentType.OTHER:
                    revenueBreakdown.otherServices += payment.amount;
                    break;
            }
        });
        // Calculate platform commission (assuming 20% of total revenue)
        revenueBreakdown.platformCommission = totalRevenue * 0.20;
        // Calculate percentages for revenue breakdown
        const revenueBreakdownWithPercentages = {
            membershipFees: {
                amount: revenueBreakdown.membershipFees,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.membershipFees / totalRevenue) * 100) : 0
            },
            seatBookings: {
                amount: revenueBreakdown.seatBookings,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.seatBookings / totalRevenue) * 100) : 0
            },
            otherServices: {
                amount: revenueBreakdown.otherServices,
                percentage: totalRevenue > 0 ? Math.round((revenueBreakdown.otherServices / totalRevenue) * 100) : 0
            },
            platformCommission: {
                amount: revenueBreakdown.platformCommission,
                percentage: 20
            }
        };
        res.status(200).json({
            success: true,
            data: {
                monthlyRevenue: {
                    amount: monthlyRevenue,
                    change: Number(revenueChangePercent.toFixed(1)),
                    period: "last month"
                },
                revenueBreakdown: revenueBreakdownWithPercentages,
                totalRevenue: totalRevenue
            },
        });
    }
    catch (error) {
        console.error('Revenue Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue data',
            error: error.message,
        });
    }
};
// ==========================================
// 3. PLATFORM GROWTH CONTROLLER
// ==========================================
export const getPlatformGrowthController = async (_req, res) => {
    try {
        const now = new Date();
        // Platform growth data (monthly for past 12 months)
        const growthData = [];
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const [libraryCount, memberCount, revenue] = await Promise.all([
                prisma.library.count({
                    where: {
                        status: 'APPROVED',
                        createdAt: { lte: monthEnd }
                    }
                }),
                prisma.user.count({
                    where: {
                        role: 'MEMBER',
                        createdAt: { lte: monthEnd }
                    }
                }),
                prisma.payment.aggregate({
                    _sum: { amount: true },
                    where: {
                        status: 'COMPLETED',
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    }
                })
            ]);
            growthData.push({
                month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                libraries: libraryCount,
                members: memberCount,
                revenue: revenue._sum.amount ?? 0
            });
        }
        res.status(200).json({
            success: true,
            data: {
                platformGrowth: growthData,
                period: "past 12 months"
            },
        });
    }
    catch (error) {
        console.error('Platform Growth Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch platform growth data',
            error: error.message,
        });
    }
};
/**
 * @route GET /api/dashboard/admin
 * @desc Get admin dashboard stats from database
 * @access Private (Admin)
 */
// export const getAdminDashboard = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const libraryId = req.;
//     const role = req.role;
//     if (!libraryId || role !== 'ADMIN') {
//       res.status(403).json({ success: false, message: 'Forbidden' });
//       return;
//       // console.log(libraryId);
//       // console.log(role);
//       // console.log(req.user)
//     }
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);
//     const [
//       todayBookings,
//       activeMembers,
//       revenueResult,
//       checkedOutBooks,
//       totalSeats,
//       totalBooks,
//       availableBooks,
//     ] = await Promise.all([
//       prisma.seatBooking.count({
//         where: {
//           libraryId,
//           date: {
//             gte: today,
//             lt: tomorrow,
//           },
//         },
//       }),
//       prisma.user.count({
//         where: {
//           role: 'MEMBER',
//           memberships: {
//             some: {
//               libraryId: libraryId,
//             },
//           },
//         },
//       }),
//       prisma.payment.aggregate({
//         _sum: {
//           amount: true,
//         },
//         where: {
//           createdAt: {
//             gte: today,
//             lt: tomorrow,
//           },
//           membership: {
//             libraryId: libraryId,
//           },
//         },
//       }),
//       prisma.eBook.count({
//         where: {
//           libraryId,
//           status: 'CHECKED_OUT',
//         },
//       }),
//       prisma.seat.count({
//         where: { libraryId },
//       }),
//       prisma.eBook.count({
//         where: { libraryId },
//       }),
//       prisma.eBook.count({
//         where: {
//           libraryId,
//           status: 'AVAILABLE',
//         },
//       }),
//     ]);
//     const occupancyRate = {
//       current: todayBookings,
//       total: totalSeats,
//       percentage: totalSeats ? Math.floor((todayBookings / totalSeats) * 100) : 0,
//     };
//     const inventoryStatus = {
//       total: totalBooks,
//       available: availableBooks,
//       checkedOut: checkedOutBooks,
//     };
//     res.status(200).json({
//       success: true,
//       data: {
//         todayBookings,
//         activeMembers,
//         todayRevenue: revenueResult._sum.amount ?? 0,
//         occupancyRate,
//         inventoryStatus,
//       },
//     });
//     return;
//   } catch (error: any) {
//     console.error('Admin Dashboard Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch admin dashboard stats',
//       error: error.message,
//     });
//     return;
//   }
// };
/**
 * @desc Get member dashboard stats
 * @route GET /api/dashboard/member
 * @access Private (Member only)
 */
export const getMemberDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const [upcomingBookings, booksReadCount, readingHistory] = await Promise.all([
            prisma.seatBooking.findMany({
                where: {
                    userId,
                    date: {
                        gte: new Date(),
                    },
                },
                orderBy: { date: 'asc' },
                take: 1,
            }),
            prisma.readingHistory.count({
                where: {
                    userId,
                    isCompleted: true,
                },
            }),
            prisma.readingHistory.findMany({
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
//# sourceMappingURL=dashboardController.js.map