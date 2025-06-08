import type { MembershipPlan } from "./user"

// Enums matching backend schema
export type LibraryStatus = "PENDING" | "APPROVED" | "REJECTED"

// export type SeatType = "REGULAR" | "QUIET_ZONE" | "COMPUTER" | "STUDY_ROOM" | "GROUP_TABLE"

export type SeatType = {
  id: string
  name: string // e.g., "Regular", "Quiet Zone", "Computer", "Study Room", "Group Table"
  pricePerHour?: number | 0 // Optional, can be set to 0 if not applicable
  description: string
  color: string // Color code for UI representation
  amenities?: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  libraryId: string
  // New fields from API response
  totalSeats?: number
  availableSeats?: number
  occupiedSeats?: number
}


export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"

export type MaintenanceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

// Legacy amenity type for backwards compatibility
export type LibraryAmenity =
  | "wifi"
  | "ac"
  | "cafe"
  | "power_outlets"
  | "quiet_zones"
  | "meeting_rooms"
  | "computers"

export type OpeningHour = {
  id: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  openTime: string // Format: "HH:MM"
  closeTime: string // Format: "HH:MM"
  isClosed?: boolean
  libraryId: string
}

// Legacy opening hours type for backwards compatibility
export type OpeningHours = {
  [key in
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"]: {
    open: string
    close: string
  }
}

export type SeatPrice = {
  id: string
  seatType: SeatType
  price: number
  currency?: string
  isHourly?: boolean
  createdAt?: string
  updatedAt?: string
  libraryId: string
}

export type LibraryStaff = {
  id: string
  position: string
  joinedAt?: string
  isActive?: boolean
  userId: string
  libraryId: string
}

export type Admin = {
  id: string
  name: string
  email: string
  role: "MEMBER" | "ADMIN" | "SUPER_ADMIN"
  createdAt?: string
  auth0UserId?: string
  avatar?: string
  bio?: string
  phone?: string
}

export type Library = {
  id: string
  name: string
  description: string
  address: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  email?: string
  phone?: string
  images?: string[]
  rating?: number
  reviewCount?: number
  amenities?: string[] // Now stored as array of strings in schema
  totalSeats?: number
  additinalInformation?: string // Note: matches schema typo
  AdminGovernmentId?: string
  AdminBio?: string
  AdminCompleteAddress?: string
  AdminPhone?: string
  AdminPhoto?: string
  status?: LibraryStatus
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  adminId?: string
  admin?: Admin
  // Relations (optional for most use cases)
  openingHours?: OpeningHour[] | OpeningHours // Support both formats
  membershipPlans?: MembershipPlan[]
  seatPrices?: SeatPrice[]
  memberId?: string[]
  // Legacy fields for backwards compatibility
  availableSeats?: number
  ownerId?: string // Legacy field
}

export type Seat = {
  id: string
  name: string // e.g., "A-001", "Computer-01", "Study Room-1"
  seatTypeId: string // Reference to SeatType
  seatType?: SeatType // Nested SeatType object from new API response
  isAvailable?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  libraryId: string
  position?: {
    x: number // X coordinate for UI representation
    y: number // Y coordinate for UI representation
  }
  booking?: SeatBooking // Optional relation to latest booking
  bookings?: SeatBooking[] // Array of bookings from new API response
}

export type SeatBooking = {
  id: string
  date: string // Booking date
  startTime: string // Format: "HH:MM"
  endTime: string // Format: "HH:MM"
  duration: number // Duration in hours
  bookingPrice: number // Final price calculated at booking time
  currency?: string
  status: BookingStatus
  createdAt?: string
  updatedAt?: string
  userId: string
  seatId: string
  libraryId: string
  // Relations (optional)
  user?: { id: string; name: string }
  seat?: Seat
  library?: { id: string; name: string }
  // Legacy fields for backwards compatibility
  userName?: string
  seatName?: string
  libraryName?: string
}

export type Event = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  isPublic?: boolean
  maxAttendees?: number
  createdAt?: string
  updatedAt?: string
  libraryId: string
}

export type Announcement = {
  id: string
  title: string
  content: string
  isPublic?: boolean
  isPinned?: boolean
  expiresAt?: string
  createdAt?: string
  updatedAt?: string
  libraryId: string
}

export type MaintenanceRecord = {
  id: string
  title: string
  description: string
  status: MaintenanceStatus
  priority: MaintenancePriority
  scheduledDate?: string
  completedDate?: string
  cost?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
  libraryId: string
}

export type Review = {
  id: string
  rating: number // 1-5
  comment?: string
  createdAt?: string
  updatedAt?: string
  userId: string
  libraryId?: string
  physicalBookId?: string
  eBookId?: string
  // Relations (optional)
  user?: { id: string; name: string; avatar?: string }
}
