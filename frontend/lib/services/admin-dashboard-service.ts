// Admin Dashboard Service - calls real API endpoints instead of mock data

export interface DashboardStats {
  count: number;
  change: number;
  comparedTo: string;
}

export interface RevenueStats {
  amount: number;
  change: number;
  comparedTo: string;
}

export interface OccupancyRate {
  current: number;
  total: number;
}

export interface BookCategory {
  name: string;
  count: number;
}

export interface Inventory {
  totalBooks: number;
  available: number;
  checkedOut: number;
  categories: BookCategory[];
}

export interface RecentActivity {
  type: string;
  userName: string;
  time: string;
  seatName: string;
  id: string;
  avatar?: string;
}

export interface AdminDashboardData {
  todaysBookings: DashboardStats;
  activeMembers: DashboardStats;
  todaysRevenue: RevenueStats;
  booksCheckedOut: DashboardStats;
  occupancyRate: OccupancyRate;
  inventory: Inventory;
  recentActivity: RecentActivity[];
}

// Simulate API delay for development (remove in production)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AdminDashboardService = {
  // Get admin dashboard data
  getDashboardData: async (): Promise<AdminDashboardData> => {
    try {
      const response = await fetch('/api/dashboard/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for Auth0 session
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch dashboard data`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      throw error;
    }
  },
};
