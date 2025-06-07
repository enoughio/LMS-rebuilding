// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Progress } from '@radix-ui/react-progress'
// import React from 'react'

// const Revenue = () => {
//   return (
//     <div>
//               <Card className="bg-white dark:bg-gray-800">
//                   <CardHeader>
//                     <CardTitle>Revenue Breakdown</CardTitle>
//                     <CardDescription>Revenue sources for the current month</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div>
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-sm font-medium">Membership Fees</span>
//                           <span className="text-sm">
//                             ₹{mockDashboardData.revenueBreakdown.membershipFees.amount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Progress value={mockDashboardData.revenueBreakdown.membershipFees.percentage} className="h-2 bg-black " />
//                           <span className="text-xs text-muted-foreground">
//                             {mockDashboardData.revenueBreakdown.membershipFees.percentage}% of total Revenue
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-sm font-medium">Seat Bookings</span>
//                           <span className="text-sm">
//                             ₹{mockDashboardData.revenueBreakdown.seatBookings.amount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Progress value={mockDashboardData.revenueBreakdown.seatBookings.percentage} className="h-2 bg-black" />
//                           <span className="text-xs text-muted-foreground">
//                             {mockDashboardData.revenueBreakdown.seatBookings.percentage}% of total Revenue
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-sm font-medium">Other Services</span>
//                           <span className="text-sm">
//                             ₹{mockDashboardData.revenueBreakdown.otherServices.amount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Progress value={mockDashboardData.revenueBreakdown.otherServices.percentage} className="h-2 bg-black" />
//                           <span className="text-xs text-muted-foreground">
//                             {mockDashboardData.revenueBreakdown.otherServices.percentage}% of total Revenue
//                           </span>
//                         </div>
//                       </div>
//                       <div>
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-sm font-medium">Platform Commission</span>
//                           <span className="text-sm">
//                             ₹{mockDashboardData.revenueBreakdown.platformCommission.amount.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Progress value={mockDashboardData.revenueBreakdown.platformCommission.percentage} className="h-2 bg-black" />
//                           <span className="text-xs text-muted-foreground">
//                             {mockDashboardData.revenueBreakdown.platformCommission.percentage}% of total Revenue
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//     </div>
//   )
// }

// export default Revenue



// // Mock data for super admin dashboard
// const mockDashboardData = {
//   platformStats: {
//     totalLibraries: {
//       count: 42,
//       change: 3,
//       period: "this month",
//     },
//     totalMembers: {
//       count: 24853,
//       change: 287,
//       period: "this month",
//     },
//     monthlyRevenue: {
//       amount: 48295,
//       change: 12.5,
//       period: "last month",
//     },
//     platformHealth: {
//       percentage: 99.8,
//       uptime: "this month",
//     },
//   },
//   revenueBreakdown: {
//     membershipFees: {
//       amount: 32450,
//       percentage: 67,
//     },
//     seatBookings: {
//       amount: 12845,
//       percentage: 27,
//     },
//     otherServices: {
//       amount: 3000,
//       percentage: 6,
//     },
//     platformCommission: {
//       amount: 9659,
//       percentage: 20,
//     },
//   },
//   topLibraries: [
//     {
//       id: "lib-1",
//       name: "Central City Library",
//       location: "Downtown, Central City",
//       Revenue: 5240,
//     },
//     {
//       id: "lib-2",
//       name: "Riverside Reading Hub",
//       location: "Riverside, Central City",
//       Revenue: 4120,
//     },
//     {
//       id: "lib-3",
//       name: "Knowledge Corner",
//       location: "University Area, Central City",
//       Revenue: 3980,
//     },
//     {
//       id: "lib-4",
//       name: "Tech Library Hub",
//       location: "Innovation District, Central City",
//       Revenue: 3750,
//     },
//   ],
//   systemStatus: {
//     allOperational: true,
//     lastChecked: "5 min ago",
//     resources: {
//       cpu: 32,
//       memory: 65,
//       storage: 48,
//     },
//     maintenance: {
//       scheduled: true,
//       date: "May 2, 2025",
//       status: "Resolved",
//     },
//   },
//   pendingApprovals: [
//     {
//       id: "app-1",
//       name: "Westside Community Library",
//       location: "Westside, Central City",
//     },
//     {
//       id: "app-2",
//       name: "Eastside Reading Center",
//       location: "Eastside, Central City",
//     },
//     {
//       id: "app-3",
//       name: "North Hills Book Club",
//       location: "North Hills, Central City",
//     },
//   ],
//   recentActivities: [
//     {
//       id: "act-1",
//       type: "system_update",
//       title: "System Update Deployed",
//       description: "Version 2.5.0 deployed with new features",
//       time: "2 hours ago",
//     },
//     {
//       id: "act-2",
//       type: "library_approved",
//       title: "New Library Approved",
//       description: "Sunshine Reading Lounge has been approved",
//       time: "5 hours ago",
//     },
//   ],
// }




'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@radix-ui/react-progress'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface RevenueData {
  success: boolean
  data: {
    monthlyRevenue: {
      amount: number
      change: number
      period: string
    }
    revenueBreakdown: {
      membershipFees: {
        amount: number
        percentage: number
      }
      seatBookings: {
        amount: number
        percentage: number
      }
      otherServices: {
        amount: number
        percentage: number
      }
      platformCommission: {
        amount: number
        percentage: number
      }
    }
    totalRevenue: number
  }
}

const Revenue = () => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/dashboard/revenue', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: RevenueData = await response.json()
        
        if (!data.success) {
          throw new Error('Failed to fetch revenue data')
        }

        toast.success('Revenue data loaded successfully!')
        setRevenueData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 min-w-[300px] border-0 min-h-[400px]">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error || !revenueData) {
    return (
      <Card className="bg-white dark:bg-gray-800 min-w-[300px] border-0 min-h-[400px]">
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Error: {error || 'Failed to load revenue data'}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 min-w-[300px] min-h-[400px] border-0">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Revenue sources for the current month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Membership Fees</span>
              <span className="text-sm">
                ₹{revenueData.data.revenueBreakdown.membershipFees.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={revenueData.data.revenueBreakdown.membershipFees.percentage} className="h-2 bg-black" />
              <span className="text-xs text-muted-foreground">
                {revenueData.data.revenueBreakdown.membershipFees.percentage}% of total Revenue
              </span>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Seat Bookings</span>
              <span className="text-sm">
                ₹{revenueData.data.revenueBreakdown.seatBookings.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={revenueData.data.revenueBreakdown.seatBookings.percentage} className="h-2 bg-black" />
              <span className="text-xs text-muted-foreground">
                {revenueData.data.revenueBreakdown.seatBookings.percentage}% of total Revenue
              </span>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Other Services</span>
              <span className="text-sm">
                ₹{revenueData.data.revenueBreakdown.otherServices.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={revenueData.data.revenueBreakdown.otherServices.percentage} className="h-2 bg-black" />
              <span className="text-xs text-muted-foreground">
                {revenueData.data.revenueBreakdown.otherServices.percentage}% of total Revenue
              </span>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Platform Commission</span>
              <span className="text-sm">
                ₹{revenueData.data.revenueBreakdown.platformCommission.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={revenueData.data.revenueBreakdown.platformCommission.percentage} className="h-2 bg-black" />
              <span className="text-xs text-muted-foreground">
                {revenueData.data.revenueBreakdown.platformCommission.percentage}% of total Revenue
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Revenue