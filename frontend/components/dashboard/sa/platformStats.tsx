'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CreditCard, Settings, Users } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface PlatformStatsData {
  success: boolean
  data: {
    platformStats: {
      totalLibraries: {
        count: number
        change: number
        period: string
      }
      totalMembers: {
        count: number
        change: number
        period: string
      }
      monthlyRevenue?: {
        amount: number
        change: number
        period: string
      }
      platformHealth: {
        percentage: number
        uptime: string
      }
    }
  }
}

const PlatformStats = () => {
  const [statsData, setStatsData] = useState<PlatformStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: PlatformStatsData = await response.json()

        if (!data.success || !data.data.platformStats) {
          throw new Error('Invalid response structure')
        }

        setStatsData(data)
        toast.success('Platform stats loaded successfully!')
      } catch (err) {
        console.error('Error fetching platform stats:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        toast.error('Failed to load platform stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStatsData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-md" />
        ))}
      </div>
    )
  }

  if (error || !statsData) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        Error loading platform stats: {error || 'Unknown error'}. Please try again later.
      </div>
    )
  }

  const { platformStats } = statsData.data

  return (
    <div className=" mx-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 border-0">
      <Card className="bg-black text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Libraries</CardTitle>
          <Building2 className="h-8 w-8" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.totalLibraries.count}</div>
          <p className="text-xs text-gray-400">
            +{platformStats.totalLibraries.change} {platformStats.totalLibraries.period}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-black text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-8 w-8" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.totalMembers.count.toLocaleString()}</div>
          <p className="text-xs text-gray-400">
            +{platformStats.totalMembers.change} {platformStats.totalMembers.period}
          </p>
        </CardContent>
      </Card>
      {platformStats.monthlyRevenue && (
        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-8 w-8" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{platformStats.monthlyRevenue.amount.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">
              +{platformStats.monthlyRevenue.change}% from {platformStats.monthlyRevenue.period}
            </p>
          </CardContent>
        </Card>
      )}
      <Card className="bg-black text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
          <Settings className="h-8 w-8" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.platformHealth.percentage}%</div>
          <p className="text-xs text-gray-400">Uptime {platformStats.platformHealth.uptime}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlatformStats