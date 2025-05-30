"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/AuthContext" 
import type { User } from "@/types/user"

export function UserProfile() {
  const { user, logout, isLoading } = useAuth()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState<User | null>(null)

  // Fetch the latest user profile data when the component mounts
  setProfileData(user)

  const handleLogout = async () => {

      logout()
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not logged in</CardTitle>
        </CardHeader>
        <CardContent>Please log in to view your profile</CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div>Loading profile...</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-xl font-medium">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">{profileData?.name || user.name}</h3>
                <p className="text-sm text-gray-500">{profileData?.email || user.email}</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Role</span>
                <span className="capitalize">{profileData?.role || user.role}</span>
              </div>
              {user.membership && (
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Membership</span>
                  <span className="capitalize">{user.membership.planName} ({user.membership.status})</span>
                </div>
              )}
              {user.libraryId && (
                <div className="flex justify-between py-1 border-b">
                  <span className="font-medium">Library</span>
                  <span>{user.libraryName || user.libraryId}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b">
                <span className="font-medium">Account Created</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Button onClick={handleLogout} variant="outline" className="w-full mt-4">
              Sign Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
