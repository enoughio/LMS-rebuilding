export interface OpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface Seat {
  availableSeats: number;
}

interface MembershipPlan {
  name?: string;
}

export interface Library {
  _id: string;
  id?: string;
  name: string;
  images: string[];
  city: string;
  state: string;
  country: string;
  amenities: string[];
  description: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties for LibraryCard
  isActive: boolean;
  openingHours: OpeningHour[];
  reviewCount: number;
  seats: Seat[];
  membershipPlans: MembershipPlan[];
  
//   [key: string]: unknown;
}
