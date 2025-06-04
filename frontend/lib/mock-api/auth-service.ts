// import type { User, UserRole } from "@/types/user"

// // Mock users data
// const users = [
//   {
//     id: "user-1",
//     name: "John Member",
//     email: "member@example.com",
//     password: "password",
//     role:"MEMBER" as UserRole,
//     avatar: "/placeholder.svg?height=40&width=40",
//     createdAt: "2023-01-15T00:00:00Z",
//     membership: {
//       planId: "plan-1",
//       planName: "Premium",
//       status: "active",
//       expiresAt: "2024-12-31T00:00:00Z",
//     },
//   },
//   {
//     id: "user-2",
//     name: "Jane Member",
//     email: "expired@example.com",
//     password: "password",
//     role:"MEMBER" as UserRole,
//     avatar: "/placeholder.svg?height=40&width=40",
//     createdAt: "2023-02-20T00:00:00Z",
//     membership: {
//       planId: "plan-2",
//       planName: "Basic",
//       status: "expired",
//       expiresAt: "2023-10-31T00:00:00Z",
//     },
//   },
//   {
//     id: "user-3",
//     name: "Alice Admin",
//     email: "admin@example.com",
//     password: "password",
//     role: "ADMIN" as UserRole,
//     avatar: "/placeholder.svg?height=40&width=40",
//     createdAt: "2022-11-05T00:00:00Z",
//     libraryId: "lib-1",
//     libraryName: "Central Library",
//   },
//   {
//     id: "user-4",
//     name: "Bob SuperAdmin",
//     email: "superadmin@example.com",
//     password: "password",
//     role: "SUPER_ADMIN" as UserRole,
//     avatar: "/placeholder.svg?height=40&width=40",
//     createdAt: "2022-10-01T00:00:00Z",
//   },
// ]

// // Simulate API delay
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// export const mockAuthService = {
//   login: async (email: string, password: string): Promise<User> => {
//     await delay(800) // Simulate network delay

//     const user = users.find((u) => u.email === email && u.password === password)

//     if (!user) {
//       throw new Error("Invalid credentials")
//     }

//     // Store in localStorage to persist session
//     localStorage.setItem("currentUser", JSON.stringify(user))

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = user
//     return userWithoutPassword as User
//   },

//   logout: () => {
//     localStorage.removeItem("currentUser")
//   },

//   getCurrentUser: async (): Promise<User | null> => {
//     await delay(300) // Simulate network delay

//     const userJson = localStorage.getItem("currentUser")
//     if (!userJson) return null

//     return JSON.parse(userJson) as User
//   },

//   register: async (userData: any): Promise<User> => {
//     await delay(1000) // Simulate network delay

//     // Check if email already exists
//     if (users.some((u) => u.email === userData.email)) {
//       throw new Error("Email already in use")
//     }

//     // Create new user
//     const newUser = {
//       id: `user-${users.length + 1}`,
//       name: userData.name,
//       email: userData.email,
//       password: userData.password,
//       role:"MEMBER" as UserRole,
//       avatar: "/placeholder.svg?height=40&width=40",
//       createdAt: new Date().toISOString(),
//       membership: {
//         planId: "plan-free",
//         planName: "Free",
//         status: "active",
//         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
//       },
//     }

//     users.push(newUser)

//     // Store in localStorage
//     const { password: _, ...userWithoutPassword } = newUser
//     localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

//     return userWithoutPassword as User
//   },
// }
