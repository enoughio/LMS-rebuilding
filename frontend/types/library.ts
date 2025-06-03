import type { MembershipPlan } from "../types copy/user";

export type LibraryAmenity =
  | "wifi"
  | "ac"
  | "cafe"
  | "power_outlets"
  | "quiet_zones"
  | "meeting_rooms"
  | "computers";

export type OpeningHours = {
  [key in
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"]: {
    open: string;
    close: string;
  };
};

export type admin = {
  id: string;
  name: string;
  email: string;
  role:"MEMBER" ,
  createdAt: string;
  auth0UserId?: string | null; // Optional field for Auth0 user ID
}

export type Library = {
  id: string;
  name: string;
  description: string;
  address: string;
  images: string[];
  rating: number;
  reviewCount: number;
  amenities: LibraryAmenity[];
  openingHours: OpeningHours;
  membershipPlans?: MembershipPlan[];
  totalSeats?: number;
  availableSeats?: number;
  city: string;
  state: string;
  country: string;
  postalCode?: string | number;
  email: string;
  admin?: admin,
  phone?: string | number;
  additinalInformation?: string; // Note: matches schema typo
  AdminBio?: string;
  AdminCompleteAddress?: string;
  AdminPhone?: string | number;
  AdminGovernmentId?: string | null;
  AdminPhoto?: string | null;
  createdAt: string;
};

export type SeatType = "regular" | "quiet_zone" | "computer";

export type Seat = {
  id: string;
  libraryId: string;
  name: string;
  type: SeatType;
  isAvailable: boolean;
  bookings?: SeatBooking[];
};

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type SeatBooking = {
  id: string;
  userId: string;
  userName: string;
  seatId: string;
  seatName: string;
  libraryId: string;
  libraryName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
};
