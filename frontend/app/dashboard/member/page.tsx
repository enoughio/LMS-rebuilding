"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Calendar, Clock, Loader2, Timer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-provider"
import { mockLibraryService } from "@/lib/mock-api/library-service"
import { mockELibraryService } from "@/lib/mock-api/e-library-service"
import { mockStudyToolsService } from "@/lib/mock-api/study-tools-service"
import { UserProfile } from "@/components/dashboard/user-profile"
import type { SeatBooking } from "@/types/library"
import type { UserBookHistory } from "@/types/book"
import type { StudyStreak } from "@/types/study-tools"

export default function MemberDashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<SeatBooking[]>([])
  const [readingHistory, setReadingHistory] = useState<UserBookHistory[]>([])
  const [studyStreak, setStudyStreak] = useState<StudyStreak | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (user) {
          const [bookingsData, readingHistoryData, studyStreakData] = await Promise.all([
            mockLibraryService.getUserBookings(user.id),
            mockELibraryService.getUserReadingHistory(user.id),
            mockStudyToolsService.getStudyStreak(user.id),
          ])
          setBookings(bookingsData)
          setReadingHistory(readingHistoryData)
          setStudyStreak(studyStreakData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Filter bookings
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" && new Date(booking.date) >= new Date(),
  )
  const pastBookings = bookings.filter(
    (booking) => booking.status === "completed" || new Date(booking.date) < new Date(),
  )

  // Get current book
  const currentBook = readingHistory.find((book) => !book.isCompleted)

  return (
    <div className="space-y-6 max-w-[1920px] lg:overflow-x-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium">{user?.name}</span>!
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UserProfile />
      </div>

      {/* Membership Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Your current membership plan and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">{user?.membership?.planName || "Free Plan"}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={user?.membership?.status === "active" ? "default" : "destructive"}>
                  {user?.membership?.status === "active" ? "Active" : "Expired"}
                </Badge>
                {user?.membership?.status === "active" && (
                  <p className="text-sm text-muted-foreground">
                    Expires on {new Date(user.membership.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Button asChild>
              <Link href="/dashboard/member/membership">
                {user?.membership?.status === "active" ? "Manage Membership" : "Upgrade Plan"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingBookings.length === 0
                ? "No upcoming bookings"
                : upcomingBookings.length === 1
                  ? "1 seat booked"
                  : `${upcomingBookings.length} seats booked`}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/member/book-seat">Book a Seat</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Reading Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingHistory.filter((book) => book.isCompleted).length} Books</div>
            <p className="text-xs text-muted-foreground">
              {readingHistory.length === 0
                ? "No books in your history"
                : `${readingHistory.filter((book) => book.isCompleted).length} of ${
                    readingHistory.length
                  } books completed`}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/member/e-library">Browse E-Library</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyStreak?.currentStreak || 0} Days</div>
            <p className="text-xs text-muted-foreground">
              {studyStreak?.currentStreak
                ? `Current streak: ${studyStreak.currentStreak} days`
                : "Start your study streak today!"}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link href="/dashboard/member/study-tools">Study Tools</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Book */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Currently Reading</CardTitle>
            <CardDescription>Your current book in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {currentBook ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-16 overflow-hidden rounded-md">
                    <img
                      src={currentBook.book?.coverImage || "/placeholder.svg?height=96&width=64"}
                      alt={currentBook.book?.title || "Book cover"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{currentBook.book?.title || "Unknown Book"}</h3>
                    <p className="text-sm text-muted-foreground">{currentBook.book?.author || "Unknown Author"}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {currentBook.lastReadPage} of {currentBook.totalPages} pages
                        </span>
                      </div>
                      <Progress
                        value={(currentBook.lastReadPage / currentBook.totalPages) * 100}
                        className="mt-1 h-2"
                      />
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/dashboard/member/e-library/read/${currentBook.bookId}`}>Continue Reading</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No book in progress</h3>
                <p className="text-sm text-muted-foreground">Start reading a book from our e-library</p>
                <Button variant="outline" size="sm" asChild className="mt-4">
                  <Link href="/dashboard/member/e-library">Browse E-Library</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your scheduled seat reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="font-medium">{booking.libraryName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{booking.seatName}</Badge>
                  </div>
                ))}
                {upcomingBookings.length > 3 && (
                  <p className="text-center text-sm text-muted-foreground">
                    +{upcomingBookings.length - 3} more bookings
                  </p>
                )}
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/dashboard/member/book-seat">Manage Bookings</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
                <p className="text-sm text-muted-foreground">Book a seat at your favorite library</p>
                <Button variant="outline" size="sm" asChild className="mt-4">
                  <Link href="/dashboard/member/book-seat">Book a Seat</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Study Statistics</CardTitle>
          <CardDescription>Track your study progress and habits</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="streak">
            <TabsList className="mb-4">
              <TabsTrigger value="streak">Study Streak</TabsTrigger>
              <TabsTrigger value="hours">Study Hours</TabsTrigger>
            </TabsList>
            <TabsContent value="streak" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{studyStreak?.currentStreak || 0}</div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{studyStreak?.longestStreak || 0}</div>
                      <p className="text-sm text-muted-foreground">Longest Streak</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{studyStreak?.totalStudyDays || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Study Days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/dashboard/member/study-tools">
                  <Timer className="mr-2 h-4 w-4" />
                  Start Study Session
                </Link>
              </Button>
            </TabsContent>
            <TabsContent value="hours" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{studyStreak?.totalStudyHours || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Hours</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{studyStreak?.dailyGoalHours || 0}</div>
                      <p className="text-sm text-muted-foreground">Daily Goal</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Recent Study Days</h3>
                <div className="grid grid-cols-7 gap-2">
                  {studyStreak?.streakHistory.slice(0, 7).map((day, index) => (
                    <div
                      key={index}
                      className={`flex h-12 flex-col items-center justify-center rounded-md ${
                        day.goalMet ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <span className="text-xs">{new Date(day.date).getDate()}</span>
                      <span className="text-xs font-medium">{day.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
