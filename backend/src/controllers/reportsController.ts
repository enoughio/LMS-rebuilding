import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { PaymentType } from '../../generated/prisma/index.js';

// ==========================================
// 1. REVENUE REPORTS CONTROLLER
// ==========================================
export const getRevenueReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, libraryId } = req.query;
    
    // Parse date range
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 12));
    const end = endDate ? new Date(endDate as string) : new Date();
      // Build where clause for library filtering
    const buildLibraryFilter = (libraryId: string | undefined) => {
      if (!libraryId || libraryId === 'all') {
        return {};
      }
      
      return {
        OR: [
          {
            membership: {
              libraryId: libraryId
            }
          },
          {
            seatBooking: {
              libraryId: libraryId
            }
          },
          {
            bookBorrowing: {
              libraryId: libraryId
            }
          },
          {
            eBookAccess: {
              eBook: {
                libraryId: libraryId
              }
            }
          }
        ]
      };
    };

    // Get monthly revenue data for the past 12 months
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const [revenue, userCount] = await Promise.all([
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            },
            ...buildLibraryFilter(libraryId as string)
          }
        }),
        prisma.user.count({
          where: {
            role: 'MEMBER',
            createdAt: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        })
      ]);

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: revenue._sum.amount || 0,
        users: userCount
      });
    }    // Get revenue breakdown by payment type
    const revenueBreakdown = await prisma.payment.groupBy({
      by: ['type'],
      _sum: { amount: true },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: start,
          lte: end
        },
        ...buildLibraryFilter(libraryId as string)
      }
    });

    const breakdown = {
      membership: 0,
      seatBooking: 0,
      penalty: 0,
      eBookPurchase: 0,
      other: 0
    };

    revenueBreakdown.forEach(item => {
      switch (item.type) {
        case PaymentType.MEMBERSHIP:
          breakdown.membership = item._sum.amount || 0;
          break;
        case PaymentType.SEAT_BOOKING:
          breakdown.seatBooking = item._sum.amount || 0;
          break;
        case PaymentType.PENALTY:
          breakdown.penalty = item._sum.amount || 0;
          break;
        case PaymentType.EBOOK_PURCHASE:
          breakdown.eBookPurchase = item._sum.amount || 0;
          break;
        case PaymentType.OTHER:
          breakdown.other = item._sum.amount || 0;
          break;
      }
    });

    const totalRevenue = Object.values(breakdown).reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      data: {
        monthlyRevenue,
        revenueBreakdown: breakdown,
        totalRevenue,
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  } catch (error: unknown) {
    console.error('Revenue Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue reports',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ==========================================
// 2. USER ACTIVITY REPORTS CONTROLLER
// ==========================================
export const getUserActivityReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, libraryId } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(new Date().getDate() - 30));
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Get daily user activity for the specified period
    const dailyActivity = [];
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(start);
      dayStart.setDate(start.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [newUsers, activeUsers, bookings] = await Promise.all([
        prisma.user.count({
          where: {
            role: 'MEMBER',
            createdAt: {
              gte: dayStart,
              lte: dayEnd
            }
          }
        }),
        prisma.user.count({
          where: {
            role: 'MEMBER',
            lastLogin: {
              gte: dayStart,
              lte: dayEnd
            }
          }
        }),
        prisma.seatBooking.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd
            },
            ...(libraryId && libraryId !== 'all' ? { libraryId: libraryId as string } : {})
          }
        })
      ]);

      dailyActivity.push({
        date: dayStart.toISOString().split('T')[0],
        newUsers,
        activeUsers,
        bookings
      });
    }

    // Get user growth summary
    const [totalUsers, totalActiveToday, totalNewThisMonth] = await Promise.all([
      prisma.user.count({ where: { role: 'MEMBER' } }),
      prisma.user.count({
        where: {
          role: 'MEMBER',
          lastLogin: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.user.count({
        where: {
          role: 'MEMBER',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyActivity,
        summary: {
          totalUsers,
          totalActiveToday,
          totalNewThisMonth
        },
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  } catch (error: unknown) {
    console.error('User Activity Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity reports',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ==========================================
// 3. LIBRARY PERFORMANCE REPORTS CONTROLLER
// ==========================================
export const getLibraryPerformanceReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, libraryId } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    // Build where clause for library filtering
    const libraryFilter = libraryId && libraryId !== 'all' ? { id: libraryId as string } : {};

    const libraries = await prisma.library.findMany({
      where: {
        status: 'APPROVED',
        ...libraryFilter
      },
      include: {
        _count: {
          select: {
            members: true,
            seatBookings: true
          }
        }
      }
    });

    const libraryPerformance = await Promise.all(
      libraries.map(async (library) => {        const [revenue, bookings, occupancyData] = await Promise.all([
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end },
              OR: [
                { membership: { libraryId: library.id } },
                { seatBooking: { libraryId: library.id } },
                { bookBorrowing: { libraryId: library.id } },
                { eBookAccess: { eBook: { libraryId: library.id } } }
              ]
            }
          }),
          prisma.seatBooking.count({
            where: {
              libraryId: library.id,
              createdAt: { gte: start, lte: end }
            }
          }),
          prisma.seat.aggregate({
            _count: true,
            where: { libraryId: library.id }
          })
        ]);

        return {
          id: library.id,
          name: library.name,
          revenue: revenue._sum.amount || 0,
          members: library._count.members,
          bookings,
          totalSeats: occupancyData._count,
          occupancyRate: occupancyData._count > 0 ? Math.round((bookings / occupancyData._count) * 100) : 0,
          rating: library.rating,
          city: library.city,
          state: library.state
        };
      })
    );

    // Sort by revenue (descending)
    libraryPerformance.sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      data: {
        libraryPerformance,
        totalLibraries: libraries.length,
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  } catch (error: unknown) {
    console.error('Library Performance Reports Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library performance reports',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ==========================================
// 4. BOOKING ANALYTICS CONTROLLER
// ==========================================
export const getBookingAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, libraryId } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();
    
    const libraryFilter = libraryId && libraryId !== 'all' ? { libraryId: libraryId as string } : {};

    // Get booking trends by day
    const dailyBookings = [];
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(start);
      dayStart.setDate(start.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [totalBookings, completedBookings, cancelledBookings] = await Promise.all([
        prisma.seatBooking.count({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
            ...libraryFilter
          }
        }),
        prisma.seatBooking.count({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
            status: 'COMPLETED',
            ...libraryFilter
          }
        }),
        prisma.seatBooking.count({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
            status: 'CANCELLED',
            ...libraryFilter
          }
        })
      ]);

      dailyBookings.push({
        date: dayStart.toISOString().split('T')[0],
        total: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0
      });
    }    // Get booking statistics by seat type
    const bookingsBySeatType = await prisma.seatBooking.groupBy({
      by: ['seatId'],
      _count: true,
      where: {
        createdAt: { gte: start, lte: end },
        ...libraryFilter
      }
    });    // Get seat details to map seat types
    const seatIds = bookingsBySeatType.map(booking => booking.seatId);
    const seats = await prisma.seat.findMany({      where: {
        id: { in: seatIds }
        // seatTypeId: { not: null } // Filter out seats with null seatTypeId
      },
      select: {
        id: true,
        seatType: {
          select: {
            id: true,
            name: true,
          }
        },
      },
    });// Create seat type mapping
    const seatTypeMap = new Map(seats.map(seat => [seat.id, seat.seatType]));

    // Aggregate by seat type
    const seatTypeAggregated = bookingsBySeatType.reduce((acc, booking) => {
      const seatTypeObj = seatTypeMap.get(booking.seatId);
      const seatTypeName = seatTypeObj?.name || 'UNKNOWN';
      if (!acc[seatTypeName]) {
        acc[seatTypeName] = 0;
      }
      acc[seatTypeName] += booking._count;
      return acc;
    }, {} as Record<string, number>);

    const seatTypeStats = Object.entries(seatTypeAggregated).map(([seatType, count]) => ({
      seatType,
      count,
    }));

    // Get popular time slots
    const popularTimeSlots = await prisma.seatBooking.groupBy({
      by: ['startTime'],
      _count: true,
      where: {
        createdAt: { gte: start, lte: end },
        ...libraryFilter
      },
      orderBy: {
        _count: {
          startTime: 'desc'
        }
      },
      take: 10
    });    // Get booking summary
    const buildPaymentLibraryFilter = (libraryId: string | undefined) => {
      if (!libraryId || libraryId === 'all') {
        return {};
      }
      
      return {
        seatBooking: {
          libraryId: libraryId
        }
      };
    };

    const [totalBookings, totalRevenue, averageBookingValue] = await Promise.all([
      prisma.seatBooking.count({
        where: {
          createdAt: { gte: start, lte: end },
          ...libraryFilter
        }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          type: 'SEAT_BOOKING',
          status: 'COMPLETED',
          createdAt: { gte: start, lte: end },
          ...buildPaymentLibraryFilter(libraryId as string)
        }
      }),
      prisma.payment.aggregate({
        _avg: { amount: true },
        where: {
          type: 'SEAT_BOOKING',
          status: 'COMPLETED',
          createdAt: { gte: start, lte: end },
          ...buildPaymentLibraryFilter(libraryId as string)
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyBookings,        bookingsBySeatType: seatTypeStats,
        popularTimeSlots: popularTimeSlots.map(item => ({
          timeSlot: item.startTime,
          bookings: item._count
        })),
        summary: {
          totalBookings,
          totalRevenue: totalRevenue._sum.amount || 0,
          averageBookingValue: averageBookingValue._avg.amount || 0
        },
        period: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    });
  } catch (error: unknown) {
    console.error('Booking Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking analytics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ==========================================
// 5. COMPREHENSIVE REPORTS OVERVIEW
// ==========================================
export const getReportsOverview = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.query;
    
    // Get current month data
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Build library filter function
    const buildLibraryFilter = (libraryId: string | undefined) => {
      if (!libraryId || libraryId === 'all') {
        return {};
      }
      
      return {
        OR: [
          {
            membership: {
              libraryId: libraryId
            }
          },
          {
            seatBooking: {
              libraryId: libraryId
            }
          },
          {
            bookBorrowing: {
              libraryId: libraryId
            }
          },
          {
            eBookAccess: {
              eBook: {
                libraryId: libraryId
              }
            }
          }
        ]
      };
    };

    const [
      monthlyRevenue,
      monthlyBookings,
      activeUsers,
      newUsers,
      topLibraries
    ] = await Promise.all([
      // Monthly revenue
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth, lte: endOfMonth },
          ...buildLibraryFilter(libraryId as string)
        }
      }),
      
      // Monthly bookings
      prisma.seatBooking.count({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
          ...(libraryId && libraryId !== 'all' ? { libraryId: libraryId as string } : {})
        }
      }),
      
      // Active users this month
      prisma.user.count({
        where: {
          role: 'MEMBER',
          lastLogin: { gte: startOfMonth }
        }
      }),
      
      // New users this month
      prisma.user.count({
        where: {
          role: 'MEMBER',
          createdAt: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      
      // Top 5 performing libraries
      prisma.library.findMany({
        where: { status: 'APPROVED' },
        include: {
          _count: {
            select: {
              members: true,
              seatBookings: true
            }
          }
        },
        orderBy: {
          rating: 'desc'
        },
        take: 5
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          monthlyRevenue: monthlyRevenue._sum.amount || 0,
          monthlyBookings,
          activeUsers,
          newUsers
        },
        topLibraries: topLibraries.map(lib => ({
          id: lib.id,
          name: lib.name,
          members: lib._count.members,
          bookings: lib._count.seatBookings,
          rating: lib.rating,
          city: lib.city
        })),
        period: {
          start: startOfMonth.toISOString(),
          end: endOfMonth.toISOString()
        }
      }
    });
  } catch (error: unknown) {
    console.error('Reports Overview Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports overview',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ==========================================
// 6. GET ALL LIBRARIES FOR FILTER DROPDOWN
// ==========================================
export const getLibrariesForReports = async (_req: Request, res: Response) => {
  try {
    const libraries = await prisma.library.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        name: true,
        city: true,
        state: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        libraries: [
          { id: 'all', name: 'All Libraries', city: '', state: '' },
          ...libraries
        ]
      }
    });
  } catch (error: unknown) {
    console.error('Get Libraries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch libraries',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
