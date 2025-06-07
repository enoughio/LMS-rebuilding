// Enums matching backend schema
export type UserRole = "MEMBER" | "ADMIN" | "SUPER_ADMIN"

export type MembershipStatus = "ACTIVE" | "FREEZE" | "EXPIRED" | "PENDING" | "CANCELLED"

export type MembershipPlanType = "MONTHLY" | "QUARTERLY" | "ANUALLY"

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"

export type PaymentType = "MEMBERSHIP" | "SEAT_BOOKING" | "PENALTY" | "EBOOK_PURCHASE" | "OTHER"

export type PaymentMedium = "OFFLINE" | "ONLINE"

export type NotificationType = "INFO" | "WARNING" | "SUCCESS" | "ERROR"

// Main types
export type MembershipPlan = {
  id: string
  name: string
  description?: string
  price: number
  duration: number // in days
  features: string[]
  allowedBookingsPerMonth: number
  eLibraryAccess?: boolean
  maxBorrowedBooks?: number
  maxBorrowDuration?: number // in days
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  libraryId?: string
}

export type Membership = {
  id: string
  startDate: string
  endDate: string
  status: MembershipStatus
  autoRenew?: boolean
  createdAt?: string
  updatedAt?: string
  userId: string
  libraryId: string
  membershipPlanId: string
  membershipPlan?: MembershipPlan
}

export type Payment = {
  id: string
  amount: number
  currency?: string
  type: PaymentType
  status: PaymentStatus
  medium: PaymentMedium
  paymentMethod?: string
  transactionId?: string
  receiptUrl?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  userId: string
  membershipId?: string
  seatBookingId?: string
  bookBorrowingId?: string
  eBookAccessId?: string
}

export type Notification = {
  id: string
  title: string
  message: string
  type: NotificationType
  isRead?: boolean
  createdAt?: string
  userId: string
}

export type User = {
  id: string
  auth0UserId?: string
  name: string
  email: string
  emailVerified?: boolean
  varifiedBySuperAdmin?: boolean
  role: UserRole
  avatar?: string
  bio?: string
  phone?: string
  address?: string
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
  libraryId?: string // Optional, if user is associated with a specific library
  // Relations (optional for most use cases)
  memberships?: Membership[]
  notifications?: Notification[]
  verifiedBySuperAdmin?: boolean
  payments?: Payment[]
  registeredLibraryIds?: string[]
}
