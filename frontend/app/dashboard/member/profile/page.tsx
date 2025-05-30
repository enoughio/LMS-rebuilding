"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Edit, Loader2, Mail, Phone, UserIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })

  useEffect(() => {
    if (user) {
      // In a real app, we would fetch the complete profile data
      setProfileData({
        name: user.name,
        email: user.email,
        phone: "+91 98765 43210", // Mock data
        address: "123 Main Street, Mumbai, India", // Mock data
        bio: "Avid reader and library enthusiast. Love exploring new books and quiet study spaces.", // Mock data
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    setLoading(true)

    // In a real app, this would be an API call to update the profile
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar || "/placeholder.svg?height=128&width=128"} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full bg-background">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.membership?.status === "active" ? "default" : "destructive"}>
                {user.membership?.status === "active" ? "Active Member" : "Expired"}
              </Badge>
              <Badge variant="outline">{user.membership?.planName || "Free Plan"}</Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Full Name</p>
                          <p>{profileData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone Number</p>
                          <p>{profileData.phone}</p>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p>{profileData.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Bio</p>
                        <p>{profileData.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {isEditing ? (
                    <div className="flex w-full justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  ) : null}
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Membership Details</CardTitle>
                  <CardDescription>Your current membership plan and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{user.membership?.planName || "Free Plan"}</h3>
                      <Badge variant={user.membership?.status === "active" ? "default" : "destructive"}>
                        {user.membership?.status === "active" ? "Active" : "Expired"}
                      </Badge>
                    </div>
                    {user.membership?.status === "active" && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Expires on {new Date(user.membership.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Membership Benefits</h3>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Access to all library facilities</li>
                      <li>Book reservations and seat bookings</li>
                      <li>Access to e-library resources</li>
                      <li>Participation in library events</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    {user.membership?.status === "active" ? (
                      <a href="/dashboard/member/membership">Manage Membership</a>
                    ) : (
                      <a href="/dashboard/member/membership">Upgrade Plan</a>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership History</CardTitle>
                  <CardDescription>Your past membership transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-muted-foreground">Jan 15, 2023 - Feb 15, 2023</p>
                      </div>
                      <Badge variant="outline">₹1,999</Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Basic Plan</p>
                        <p className="text-sm text-muted-foreground">Dec 15, 2022 - Jan 15, 2023</p>
                      </div>
                      <Badge variant="outline">₹999</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor="email-notifications">Enabled</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms-notifications" className="h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="sms-notifications">Disabled</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-muted-foreground">Receive promotional content</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="marketing-communications"
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="marketing-communications">Disabled</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reading Preferences</CardTitle>
                  <CardDescription>Customize your reading experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="favorite-genres">Favorite Genres</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">Fiction</Badge>
                        <Badge variant="outline">Science</Badge>
                        <Badge variant="outline">History</Badge>
                        <Badge variant="outline">Biography</Badge>
                        <Badge variant="outline">+ Add</Badge>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="reading-format">Preferred Reading Format</Label>
                      <div className="mt-2">
                        <select
                          id="reading-format"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          defaultValue="physical"
                        >
                          <option value="physical">Physical Books</option>
                          <option value="ebook">E-Books</option>
                          <option value="audiobook">Audiobooks</option>
                          <option value="all">All Formats</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
