"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoginUser, GetCurrentUser, RegisterUser, RegisterAdmin, LogoutUser } from "@/lib/services/auth-service"
import type { User} from "@/types/user"
import toast from "react-hot-toast"

type LogoutResult = {
  success: boolean;
  message: string;
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<LogoutResult>
  register: (userData: RegisterUserData) => Promise<User>
  // registerMember: (userData: RegisterUserData) => Promise<User>
  registerAdmin: (userData: RegisterUserData) => Promise<User>
  // registerSuperAdmin: (userData: RegisterSuperAdminData) => Promise<User>
}

// Define proper type interfaces for user registration
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Interface not currently used but may be needed in future
// interface RegisterSuperAdminData extends RegisterUserData {
//   city: string;
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname() || ""

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = async () => {
      try {
        // First try to get user from localStorage to prevent flicker
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }

        const userData = await GetCurrentUser();
        
        if (userData) {
          setUser(userData);
          // Update localStorage with latest user data
          if (typeof window !== 'undefined') {
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else {
          // Clear user if server says we're not authenticated
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user");
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [])

  useEffect(() => {
    // Handle route protection
    if (!isLoading) {
      // Public routes accessible to all
      const publicRoutes = ["/", "/about", "/contact", "/libraries", "/forume", "/forum", "/login","/register-admin", "/register"]
      const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/libraries/") || pathname.startsWith("/forum/")) || pathname.startsWith("/forume/")

      if (!user && !isPublicRoute) {
        router.push("/login")
        return
      }

      // Role-based route protection
      if (user) {
        const isMemberRoute = pathname.startsWith("/dashboard/member")
        const isAdminRoute = pathname.startsWith("/dashboard/admin")
        const isSuperAdminRoute = pathname.startsWith("/dashboard/super-admin")

       
         if ((user.role === "MEMBER" || user.role === "LOGGED_IN") && (isAdminRoute || isSuperAdminRoute)) {
          router.push("/dashboard/member")
        } else if (user.role === "ADMIN" && (isMemberRoute || isSuperAdminRoute)) {
          router.push("/dashboard/admin")
        } else if (user.role === "SUPER_ADMIN" && (isMemberRoute || isAdminRoute)) {
          router.push("/dashboard/super-admin")
        }
      }
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await LoginUser({email, password})
      // Store user data in localStorage
      if(!userData.success)
        {
          const errText = userData.message 
          throw new Error(errText)
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(userData.user));
        }
        setUser(userData.user) 
      
      return userData

    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      
      const response = await LogoutUser()
      if (!response.ok) {
        throw new Error("Logout failed")
      }

      // Clear user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user");
      }
      
      toast.success("successfully logged out")
      setUser(null)
      router.push("/")
      
      // Return success status for components that need it (for toast messages)
      return { success: true, message: "You have been successfully logged out" }
    } catch (error) {
      console.error("Logout failed:", error)
      // Still clear user state even if API call fails
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user");
      }
      // Return error status
      return { success: false, message: "Logout process encountered an error" }
    } finally {
      setIsLoading(false)
    }
  }


  const register = async (userData: RegisterUserData) => {
    setIsLoading(true)
    try {
      const newUser = await RegisterUser(userData)
      
      // Store user data in localStorage
      if(newUser.success === false)
        {
          const errText = newUser.message
          throw new Error(errText)
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(newUser.user));
        }
        
        // Return the user data so components can access response messages if needed
      setUser(newUser.user)
      return newUser
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // const registerMember = async (userData: RegisterUserData) => {
  //   setIsLoading(true)
  //   try {
  //     const newUser = await authService.registerMember(userData)
  //     setUser(newUser)
      
  //     // Store user data in localStorage
  //     if (typeof window !== 'undefined') {
  //       localStorage.setItem("user", JSON.stringify(newUser));
  //     }
      
  //     router.push("/dashboard/member")
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const registerAdmin = async (userData: RegisterUserData) => {
    setIsLoading(true)
    try {
      const response = await RegisterAdmin(userData)
      
      if(response.success === false)
      {
        const errText = response.message
        throw new Error(errText)
      }

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(response));
      }
      
      
      // Return the user data so components can access response messages if needed
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // const registerSuperAdmin = async (userData: RegisterSuperAdminData) => {
  //   setIsLoading(true)
  //   try {
  //     const newUser = await authService.registerSuperAdmin(userData)
  //     setUser(newUser)
      
  //     // Store user data in localStorage
  //     if (typeof window !== 'undefined') {
  //       localStorage.setItem("user", JSON.stringify(newUser));
  //     }
      
  //     router.push("/dashboard/super-admin")
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout, 
        register, 
        // registerMember, 
        registerAdmin, 
        // registerSuperAdmin 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}