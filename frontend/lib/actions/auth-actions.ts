// "use server"

// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"

// const COOKIE_NAME = "library_auth_token"

// // Mock users for demonstration
// const mockUsers = [
//   {
//     id: "user-1",
//     name: "John Member",
//     email: "member@example.com",
//     password: "password",
//     role: "MEMBER",
//   },
//   {
//     id: "user-2",
//     name: "Jane Admin",
//     email: "admin@example.com",
//     password: "password",
//     role: "ADMIN",
//   },
//   {
//     id: "user-3",
//     name: "Super Admin",
//     email: "superadmin@example.com",
//     password: "password",
//     role: "SUPER_ADMIN",
//   },
// ]

// export async function login(formData: FormData) {
//   const email = formData.get("email") as string
//   const password = formData.get("password") as string

//   if (!email || !password) {
//     return { error: "Email and password are required" }
//   }

//   try {
//     // Find user in mock data
//     const user = mockUsers.find((u) => u.email === email)

//     if (!user) {
//       return { error: "Invalid credentials" }
//     }

//     // Simple password check for demo
//     if (password !== user.password) {
//       return { error: "Invalid credentials" }
//     }

//     // Create a simple token (in production, use proper JWT)
//     const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }))

//     // Set the token in a cookie
//     cookies().set({
//       name: COOKIE_NAME,
//       value: token,
//       httpOnly: true,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Login error:", error)
//     return { error: "An error occurred during login" }
//   }
// }

// export async function logout() {
//   cookies().delete(COOKIE_NAME)
//   redirect("/login")
// }

// export async function register(formData: FormData) {
//   const name = formData.get("name") as string
//   const email = formData.get("email") as string
//   const password = formData.get("password") as string

//   if (!name || !email || !password) {
//     return { error: "All fields are required" }
//   }

//   try {
//     // Check if user already exists
//     const existingUser = mockUsers.find((u) => u.email === email)

//     if (existingUser) {
//       return { error: "Email already in use" }
//     }

//     // Create new user (in demo, just simulate)
//     const user = {
//       id: `user-${Date.now()}`,
//       name,
//       email,
//       password,
//       role: "MEMBER",
//     }

//     // Add to mock users (in demo only)
//     mockUsers.push(user)

//     // Create a simple token
//     const token = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }))

//     // Set the token in a cookie
//     cookies().set({
//       name: COOKIE_NAME,
//       value: token,
//       httpOnly: true,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Registration error:", error)
//     return { error: "An error occurred during registration" }
//   }
// }

// export async function getCurrentUser() {
//   const token = cookies().get(COOKIE_NAME)?.value

//   if (!token) {
//     return null
//   }

//   try {
//     // Decode the simple token
//     const decoded = JSON.parse(atob(token)) as {
//       id: string
//       email: string
//       role: string
//     }

//     // Find user in mock data
//     const user = mockUsers.find((u) => u.id === decoded.id)

//     if (!user) {
//       return null
//     }

//     return {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     }
//   } catch (error) {
//     console.error("Token verification error:", error)
//     return null
//   }
// }
