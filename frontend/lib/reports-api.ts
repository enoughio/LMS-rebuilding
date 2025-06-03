// Types for reports API responses
export interface RevenueData {
  month: string;
  revenue: number;
  users: number;
}

export interface RevenueBreakdown {
  membership: number;
  seatBooking: number;
  penalty: number;
  eBookPurchase: number;
  other: number;
}

export interface RevenueReportsResponse {
  monthlyRevenue: RevenueData[];
  revenueBreakdown: RevenueBreakdown;
  totalRevenue: number;
  period: {
    start: string;
    end: string;
  };
}

export interface UserActivityData {
  date: string;
  newUsers: number;
  activeUsers: number;
  bookings: number;
}

export interface UserActivitySummary {
  totalUsers: number;
  totalActiveToday: number;
  totalNewThisMonth: number;
}

export interface UserActivityReportsResponse {
  dailyActivity: UserActivityData[];
  summary: UserActivitySummary;
  period: {
    start: string;
    end: string;
  };
}

export interface LibraryPerformanceData {
  id: string;
  name: string;
  revenue: number;
  members: number;
  bookings: number;
  totalSeats: number;
  occupancyRate: number;
  rating: number;
  city: string;
  state: string;
}

export interface LibraryPerformanceReportsResponse {
  libraryPerformance: LibraryPerformanceData[];
  totalLibraries: number;
  period: {
    start: string;
    end: string;
  };
}

export interface BookingAnalyticsData {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
  completionRate: number;
}

export interface BookingsBySeatType {
  seatType: string;
  count: number;
}

export interface PopularTimeSlot {
  timeSlot: string;
  bookings: number;
}

export interface BookingAnalyticsSummary {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
}

export interface BookingAnalyticsResponse {
  dailyBookings: BookingAnalyticsData[];
  bookingsBySeatType: BookingsBySeatType[];
  popularTimeSlots: PopularTimeSlot[];
  summary: BookingAnalyticsSummary;
  period: {
    start: string;
    end: string;
  };
}

export interface ReportsOverviewSummary {
  monthlyRevenue: number;
  monthlyBookings: number;
  activeUsers: number;
  newUsers: number;
}

export interface TopLibrary {
  id: string;
  name: string;
  members: number;
  bookings: number;
  rating: number;
  city: string;
}

export interface ReportsOverviewResponse {
  summary: ReportsOverviewSummary;
  topLibraries: TopLibrary[];
  period: {
    start: string;
    end: string;
  };
}

export interface Library {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface LibrariesListResponse {
  libraries: Library[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ReportsFilters {
  startDate?: string;
  endDate?: string;
  libraryId?: string;
}

// API Service Class
class ReportsApiService {
  private baseUrl = '/api/reports';

  private async fetchApi<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }

  async getReportsOverview(filters?: Pick<ReportsFilters, 'libraryId'>): Promise<ApiResponse<ReportsOverviewResponse>> {
    const params: Record<string, string> = {};
    if (filters?.libraryId) params.libraryId = filters.libraryId;
    
    return this.fetchApi<ReportsOverviewResponse>('/overview', params);
  }

  async getRevenueReports(filters?: ReportsFilters): Promise<ApiResponse<RevenueReportsResponse>> {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.libraryId) params.libraryId = filters.libraryId;
    
    return this.fetchApi<RevenueReportsResponse>('/revenue', params);
  }

  async getUserActivityReports(filters?: ReportsFilters): Promise<ApiResponse<UserActivityReportsResponse>> {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.libraryId) params.libraryId = filters.libraryId;
    
    return this.fetchApi<UserActivityReportsResponse>('/users', params);
  }

  async getLibraryPerformanceReports(filters?: ReportsFilters): Promise<ApiResponse<LibraryPerformanceReportsResponse>> {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.libraryId) params.libraryId = filters.libraryId;
    
    return this.fetchApi<LibraryPerformanceReportsResponse>('/libraries', params);
  }

  async getBookingAnalytics(filters?: ReportsFilters): Promise<ApiResponse<BookingAnalyticsResponse>> {
    const params: Record<string, string> = {};
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;
    if (filters?.libraryId) params.libraryId = filters.libraryId;
    
    return this.fetchApi<BookingAnalyticsResponse>('/bookings', params);
  }

  async getLibrariesList(): Promise<ApiResponse<LibrariesListResponse>> {
    return this.fetchApi<LibrariesListResponse>('/libraries-list');
  }
}

// Export singleton instance
export const reportsApi = new ReportsApiService();
