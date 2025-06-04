export type UserRole =  |"MEMBER" | "ADMIN" | "SUPER_ADMIN"

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
  libraryID?: string // For admin users
  role: UserRole
  emailVerified?: boolean
  verifiedBySuperAdmin?: boolean
  avatar?: string
  address?: string
  bio?: string
  phone?: string
  createdAt?: any
  updatedAt?: any
  membership?: {
    planId: string
    planName: string
    status: MembershipStatus
    expiresAt: string
  }
  libraryId?: string // For admin users
  libraryName?: string // For admin users
}
