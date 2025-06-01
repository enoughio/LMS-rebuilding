export type UserRole =  | "MEMBER" | "ADMIN" | "SUPER_ADMIN"

export type MembershipStatus = "active" | "expired" | "pending"

export type MembershipPlan = {
  id: string
  name: string
  price: number
  duration: number // in days
  features: string[]
  allowedBookingsPerMonth: number
  eLibraryAccess: boolean
}

export type User = {
  id: string
  name: string
  username?: string
  auth0UserId?: string
  email: string
  role: UserRole
  emailVerified?: boolean
  verifiedBySuperAdmin?: boolean
  avatar?: string
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