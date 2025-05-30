"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownUp, CreditCard, Download, FileText, Loader2, Search, Filter, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock libraries for filter dropdown
const mockLibraries = [
  { id: "all", name: "All Libraries" },
  { id: "lib-1", name: "Central Library" },
  { id: "lib-2", name: "Riverside Reading Hub" },
  { id: "lib-3", name: "Tech Knowledge Center" },
]

// Mock payment data
type Payment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  amount: number
  status: "successful" | "pending" | "failed"
  type: "membership" | "seat_booking" | "ebook_purchase" | "physical_book" | "penalty" | "other"
  date: string
  description: string
  invoiceId: string
  libraryId: string
  libraryName: string
}

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    userId: "user-5",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 1999,
    status: "successful",
    type: "membership",
    date: "2023-10-15T10:30:00Z",
    description: "Premium Membership - Monthly",
    invoiceId: "INV-2023-001",
    libraryId: "lib-1",
    libraryName: "Central Library",
  },
  {
    id: "pay-2",
    userId: "user-6",
    userName: "Michael Brown",
    userEmail: "michael@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 999,
    status: "successful",
    type: "membership",
    date: "2023-10-12T14:45:00Z",
    description: "Basic Membership - Monthly",
    invoiceId: "INV-2023-002",
    libraryId: "lib-2",
    libraryName: "Riverside Reading Hub",
  },
  {
    id: "pay-3",
    userId: "user-7",
    userName: "Sophia Garcia",
    userEmail: "sophia@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 300,
    status: "successful",
    type: "seat_booking",
    date: "2023-10-10T09:15:00Z",
    description: "Seat Booking - Quiet Zone",
    invoiceId: "INV-2023-003",
    libraryId: "lib-3",
    libraryName: "Tech Knowledge Center",
  },
  {
    id: "pay-4",
    userId: "user-8",
    userName: "James Johnson",
    userEmail: "james@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 250,
    status: "pending",
    type: "seat_booking",
    date: "2023-10-09T16:20:00Z",
    description: "Seat Booking - Computer Zone",
    invoiceId: "INV-2023-004",
    libraryId: "lib-1",
    libraryName: "Central Library",
  },
  {
    id: "pay-5",
    userId: "user-9",
    userName: "Olivia Martinez",
    userEmail: "olivia@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 1999,
    status: "failed",
    type: "membership",
    date: "2023-10-08T11:30:00Z",
    description: "Premium Membership - Monthly",
    invoiceId: "INV-2023-005",
    libraryId: "lib-2",
    libraryName: "Riverside Reading Hub",
  },
  {
    id: "pay-6",
    userId: "user-5",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 150,
    status: "successful",
    type: "penalty",
    date: "2023-10-05T13:45:00Z",
    description: "Late Fee Payment",
    invoiceId: "INV-2023-006",
    libraryId: "lib-1",
    libraryName: "Central Library",
  },
  {
    id: "pay-7",
    userId: "user-10",
    userName: "William Davis",
    userEmail: "william@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 450,
    status: "successful",
    type: "ebook_purchase",
    date: "2023-10-03T15:20:00Z",
    description: "E-Book Purchase - 'Modern Programming'",
    invoiceId: "INV-2023-007",
    libraryId: "lib-3",
    libraryName: "Tech Knowledge Center",
  },
  {
    id: "pay-8",
    userId: "user-11",
    userName: "Ava Taylor",
    userEmail: "ava@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 200,
    status: "successful",
    type: "physical_book",
    date: "2023-09-28T11:15:00Z",
    description: "Physical Book Deposit",
    invoiceId: "INV-2023-008",
    libraryId: "lib-2",
    libraryName: "Riverside Reading Hub",
  },
]

// Library revenue stats
type LibraryRevenue = {
  id: string
  name: string
  totalRevenue: number
  membershipRevenue: number
  seatBookingRevenue: number
  ebookRevenue: number
  physicalBookRevenue: number
  penaltyRevenue: number
  otherRevenue: number
  transactionCount: number
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [libraryFilter, setLibraryFilter] = useState<string>("all")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState<{
    from: string
    to: string
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Last 30 days
    to: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    // Simulate API call to fetch payments
    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch data from an API
        setPayments(mockPayments)
      } catch (error) {
        console.error("Error fetching payment data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate library revenue stats
  const libraryRevenueStats: LibraryRevenue[] = mockLibraries
    .filter((lib) => lib.id !== "all")
    .map((library) => {
      const libraryPayments = payments.filter(
        (payment) => payment.libraryId === library.id && payment.status === "successful",
      )

      return {
        id: library.id,
        name: library.name,
        totalRevenue: libraryPayments.reduce((sum, payment) => sum + payment.amount, 0),
        membershipRevenue: libraryPayments
          .filter((payment) => payment.type === "membership")
          .reduce((sum, payment) => sum + payment.amount, 0),
        seatBookingRevenue: libraryPayments
          .filter((payment) => payment.type === "seat_booking")
          .reduce((sum, payment) => sum + payment.amount, 0),
        ebookRevenue: libraryPayments
          .filter((payment) => payment.type === "ebook_purchase")
          .reduce((sum, payment) => sum + payment.amount, 0),
        physicalBookRevenue: libraryPayments
          .filter((payment) => payment.type === "physical_book")
          .reduce((sum, payment) => sum + payment.amount, 0),
        penaltyRevenue: libraryPayments
          .filter((payment) => payment.type === "penalty")
          .reduce((sum, payment) => sum + payment.amount, 0),
        otherRevenue: libraryPayments
          .filter((payment) => payment.type === "other")
          .reduce((sum, payment) => sum + payment.amount, 0),
        transactionCount: libraryPayments.length,
      }
    })

  // Apply filters and sorting
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.libraryName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter
      const matchesType = typeFilter === "all" || payment.type === typeFilter
      const matchesLibrary = libraryFilter === "all" || payment.libraryId === libraryFilter

      const paymentDate = new Date(payment.date)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999) // Set to end of day

      const matchesDateRange = paymentDate >= fromDate && paymentDate <= toDate

      return matchesSearch && matchesStatus && matchesType && matchesLibrary && matchesDateRange
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()

      return sortDirection === "desc" ? dateB - dateA : dateA - dateB
    })

  // Calculate total revenue
  const totalRevenue = payments
    .filter((payment) => payment.status === "successful")
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Calculate filtered revenue
  const filteredRevenue = filteredPayments
    .filter((payment) => payment.status === "successful")
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Get transaction count by type
  const transactionsByType = {
    membership: payments.filter((p) => p.type === "membership" && p.status === "successful").length,
    seat_booking: payments.filter((p) => p.type === "seat_booking" && p.status === "successful").length,
    ebook_purchase: payments.filter((p) => p.type === "ebook_purchase" && p.status === "successful").length,
    physical_book: payments.filter((p) => p.type === "physical_book" && p.status === "successful").length,
    penalty: payments.filter((p) => p.type === "penalty" && p.status === "successful").length,
    other: payments.filter((p) => p.type === "other" && p.status === "successful").length,
  }

  // Render payment type label
  const renderPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "membership":
        return "Membership"
      case "seat_booking":
        return "Seat Booking"
      case "ebook_purchase":
        return "E-Book Purchase"
      case "physical_book":
        return "Physical Book"
      case "penalty":
        return "Late Fee/Penalty"
      case "other":
        return "Other"
      default:
        return type.replace(/_/g, " ")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage and track payments across all libraries</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all libraries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Filtered Revenue</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{filteredRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on current filters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter((payment) => payment.status === "successful").length}
            </div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Library</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {libraryRevenueStats.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Highest revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="library-revenue">Library Revenue</TabsTrigger>
          <TabsTrigger value="revenue-types">Revenue by Type</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">From</span>
                    <Input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">To</span>
                    <Input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={libraryFilter} onValueChange={setLibraryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by library" />
                </SelectTrigger>
                <SelectContent>
                  {mockLibraries.map((library) => (
                    <SelectItem key={library.id} value={library.id}>
                      {library.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="seat_booking">Seat Booking</SelectItem>
                  <SelectItem value="ebook_purchase">E-Book</SelectItem>
                  <SelectItem value="physical_book">Physical Book</SelectItem>
                  <SelectItem value="penalty">Penalties</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
                title={`Sort by date ${sortDirection === "desc" ? "oldest first" : "newest first"}`}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border py-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Library</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Date</div>
              </div>
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={payment.userAvatar || "/placeholder.svg"} alt={payment.userName} />
                      <AvatarFallback>{payment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{payment.userName}</p>
                      <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm">{payment.libraryName}</p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="font-medium">₹{payment.amount}</span>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge
                      variant={
                        payment.status === "successful"
                          ? "default"
                          : payment.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm">{renderPaymentTypeLabel(payment.type)}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm">{new Date(payment.date).toLocaleDateString()}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPayments.length} of {payments.length} transactions
            </p>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Transactions
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="library-revenue" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {libraryRevenueStats.map((library) => (
              <Card key={library.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{library.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="text-xl font-bold">₹{library.totalRevenue.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Membership</span>
                      <span>₹{library.membershipRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Seat Booking</span>
                      <span>₹{library.seatBookingRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>E-Books</span>
                      <span>₹{library.ebookRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Physical Books</span>
                      <span>₹{library.physicalBookRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Penalties</span>
                      <span>₹{library.penaltyRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Other</span>
                      <span>₹{library.otherRevenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Transactions</span>
                    <span className="font-medium">{library.transactionCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Revenue Report
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="revenue-types" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-end gap-8 pt-6">
                {Object.entries(transactionsByType).map(([type, count]) => {
                  const typeRevenue = payments
                    .filter((p) => p.type === type && p.status === "successful")
                    .reduce((sum, payment) => sum + payment.amount, 0)

                  const percentage = totalRevenue > 0 ? Math.round((typeRevenue / totalRevenue) * 100) : 0

                  // Generate a different color for each type
                  const colors = {
                    membership: "bg-blue-500",
                    seat_booking: "bg-green-500",
                    ebook_purchase: "bg-purple-500",
                    physical_book: "bg-yellow-500",
                    penalty: "bg-red-500",
                    other: "bg-gray-500",
                  }

                  return (
                    <div key={type} className="flex flex-1 flex-col items-center">
                      <div className="relative flex w-full flex-col items-center">
                        <div
                          className={`w-full rounded-t-md ${colors[type as keyof typeof colors]}`}
                          style={{ height: `${percentage}%` }}
                        ></div>
                        <span className="mt-2 text-sm">{renderPaymentTypeLabel(type)}</span>
                      </div>
                      <div className="mt-2 text-center">
                        <div className="font-medium">₹{typeRevenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(transactionsByType)
                    .map(([type, count]) => ({
                      type,
                      revenue: payments
                        .filter((p) => p.type === type && p.status === "successful")
                        .reduce((sum, payment) => sum + payment.amount, 0),
                    }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{renderPaymentTypeLabel(item.type)}</p>
                          <p className="text-sm text-muted-foreground">
                            {transactionsByType[item.type as keyof typeof transactionsByType]} transactions
                          </p>
                        </div>
                        <Badge variant="outline">₹{item.revenue.toLocaleString()}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  {/* This would be a chart in a real implementation showing revenue over time */}
                  <div className="flex h-full w-full items-end justify-between gap-2">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = Math.floor(Math.random() * 80) + 20
                      return (
                        <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
                          <div className="w-full rounded-md bg-primary/20" style={{ height: `${height}%` }}></div>
                          <span className="mt-2 text-center text-xs text-muted-foreground">
                            {new Date(2023, i).toLocaleString("default", { month: "short" })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-muted-foreground">68% of transactions</p>
                    </div>
                    <Badge variant="outline">₹32,450</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-muted-foreground">25% of transactions</p>
                    </div>
                    <Badge variant="outline">₹12,320</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Net Banking</p>
                      <p className="text-sm text-muted-foreground">7% of transactions</p>
                    </div>
                    <Badge variant="outline">₹3,540</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
