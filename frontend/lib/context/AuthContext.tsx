"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/user"
import toast from "react-hot-toast"


type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: () => void
  logout: () => void
  syncUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function Auth0AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: auth0User, error, isLoading: auth0Loading } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname() || ""

  // Function to sync user with backend database
  const syncUser = async () => {
    if (!auth0User) return

    try {

        const syncResponse =  await fetch('/api/sync', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const response = await syncResponse.json()
        // console.log("Syncing user with backend...", auth0User)
        console.log("Sync response:", response.data)
        if (response.success !== true) {
          console.error("Failed to sync user:", response)
          throw new Error("Failed to sync user data")
        }

      const syncedUser: User = response.data

      console.log("Backend response libraryId:", syncedUser.libraryId);
      console.log("Backend response libraryId type:", typeof syncedUser.libraryId);

      const transformedUser: User = {
        id: syncedUser.id,
        auth0UserId: syncedUser.auth0UserId,
        name: syncedUser.name,
        email: syncedUser.email,
        emailVerified: syncedUser.emailVerified,
        verifiedBySuperAdmin: syncedUser.verifiedBySuperAdmin,
        role: syncedUser.role,
        avatar: syncedUser.avatar || auth0User.picture || "",
        bio: syncedUser.bio || "",
        phone: syncedUser.phone || "",
        address: syncedUser.address || "",
        libraryId: syncedUser.libraryId,        createdAt: syncedUser.createdAt,
        updatedAt: syncedUser.updatedAt
      }
      
      console.log("Transformed user libraryId:", transformedUser.libraryId);
      console.log("Transformed user libraryId type:", typeof transformedUser.libraryId);
      
      setUser(transformedUser)
      
      // Store user data in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(transformedUser))
      }

    } catch (error) {
      // console.error("Error syncing user:", error)
      toast.error(`Failed to sync user data ${error}`)
    }
  }

  // Handle Auth0 user changes
  useEffect(() => {
    const handleAuth0User = async () => {
      if (auth0Loading) return

      if (auth0User) {
        // User is authenticated with Auth0, sync with backend
        await syncUser()
      } else {
        // User is not authenticated, clear local state
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user")
        }
      }
      
      setIsLoading(false)
    }

    handleAuth0User()
  }, [auth0User, auth0Loading, ])

  // Handle initial load from localStorage
  useEffect(() => {
    if (!auth0Loading && !auth0User) {
      // Clear any stale data if user is not authenticated
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }
  }, [auth0Loading, auth0User])

  // Route protection logic
  useEffect(() => {
    if (!isLoading && !auth0Loading) {
      const publicRoutes = [
        "/", "/about", "/contact", "/libraries", "/forum", "/forume", 
        "/login", "/register-admin", "/register"
      ]
      
      const isPublicRoute = publicRoutes.some((route) => 
        pathname === route || 
        pathname.startsWith("/libraries/") || 
        pathname.startsWith("/forum/") || 
        pathname.startsWith("/forume/")
      )

      if (!auth0User && !isPublicRoute) {
        router.push("auth/login")
        return
      }

      // Role-based route protection
      if (user) {
        const isMemberRoute = pathname.startsWith("/dashboard/member")
        const isAdminRoute = pathname.startsWith("/dashboard/admin")
        const isSuperAdminRoute = pathname.startsWith("/dashboard/SUPER_ADMIN")

        if ((user.role === "SUPER_ADMIN" ) && (isAdminRoute || isSuperAdminRoute)) {
          router.push("/dashboard/member")
        } else if (user.role === "ADMIN" && (isMemberRoute || isSuperAdminRoute)) {
          router.push("/dashboard/admin")
        } else if (user.role === "SUPER_ADMIN" && (isMemberRoute || isAdminRoute)) {
          router.push("/dashboard/SUPER_ADMIN")
        }
      }
    }
  }, [isLoading, auth0Loading, auth0User, user, pathname, router])

  const login = () => {
    router.push("/auth/login")
  }

  const logout = () => {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user")
    }
    setUser(null)
    toast.success("Successfully logged out")
    router.push("/auth/logout")
  }

  // Handle Auth0 errors
  if (error) {
    console.log("Auth0 User:", error)
    // toast.error("Authentication error occurred")
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading: isLoading || auth0Loading, 
        login, 
        logout,
        syncUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an Auth0AuthProvider")
  }
  return context
}