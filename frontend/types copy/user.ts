export type UserRole = "MEMBER" | "ADMIN" | "SUPER_ADMIN"

export type MembershipStatus = "active" | "expired" | "pending"

export type MembershipPlan = {
  id: string
  name: string
  description: string
  price: number
  duration: number // in days
  features: string[]
  allowedBookingsPerMonth: number
  eLibraryAccess: boolean
  maxBorrowedBooks: number
  maxBorrowDuration: number // in days
  isActive: boolean
  createdAt: string
  updatedAt: string
  libraryId: string
}

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  membership?: {
    planId: string
    planName: string
    status: MembershipStatus
    expiresAt: string
  }
  libraryId?: string // For admin users
  libraryName?: string // For admin users
}
