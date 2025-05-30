"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, Calendar, CreditCard, Download, FileText, Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock payment data
type Payment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string
  amount: number
  status: "successful" | "pending" | "failed"
  type: "membership" | "seat_booking" | "other"
  date: string
  description: string
  invoiceId: string
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
  },
  {
    id: "pay-6",
    userId: "user-5",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    amount: 150,
    status: "successful",
    type: "other",
    date: "2023-10-05T13:45:00Z",
    description: "Late Fee Payment",
    invoiceId: "INV-2023-006",
  },
]

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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

  // Apply filters and sorting
  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch =
        payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || payment.status === statusFilter
      const matchesType = typeFilter === "all" || payment.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
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

  // Get monthly revenue
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = payments
    .filter((payment) => {
      const paymentDate = new Date(payment.date)
      return (
        payment.status === "successful" &&
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      )
    })
    .reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage and track payments</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter((payment) => payment.status === "successful").length}
            </div>
            <p className="text-xs text-muted-foreground">Out of {payments.length} total transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="seat_booking">Seat Bookings</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or invoice ID..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="seat_booking">Seat Booking</SelectItem>
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

        <TabsContent value="all" className="mt-4">
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
                <div className="col-span-4">Customer</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Date</div>
              </div>
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
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
                    <span className="font-medium">₹{payment.amount}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
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
                    <span className="text-sm capitalize">{payment.type.replace("_", " ")}</span>
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
        </TabsContent>

        <TabsContent value="membership" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">Customer</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Description</div>
              <div className="col-span-2">Date</div>
            </div>
            {filteredPayments
              .filter((payment) => payment.type === "membership")
              .map((payment) => (
                <div key={payment.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
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
                    <span className="font-medium">₹{payment.amount}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
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
                    <span className="text-sm">{payment.description}</span>
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
        </TabsContent>

        <TabsContent value="seat_booking" className="mt-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-4">Customer</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Description</div>
              <div className="col-span-2">Date</div>
            </div>
            {filteredPayments
              .filter((payment) => payment.type === "seat_booking")
              .map((payment) => (
                <div key={payment.id} className="grid grid-cols-12 gap-4 border-b p-4 last:border-0">
                  <div className="col-span-4 flex items-center gap-3">
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
                    <span className="font-medium">₹{payment.amount}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
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
                    <span className="text-sm">{payment.description}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
