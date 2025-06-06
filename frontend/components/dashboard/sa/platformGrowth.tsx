'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface GrowthData {
  month: string
  libraries: number
  members: number
  revenue: number
}

interface ApiResponse {
  success: boolean
  data: {
    platformGrowth: GrowthData[]
    period: string
  }
}

const PlatformGrowth = () => {
  const [data, setData] = useState<GrowthData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard/growth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const json: ApiResponse = await res.json()
        if (!json.success || !json.data.platformGrowth) {
          throw new Error('Invalid response structure')
        }

        setData(json.data.platformGrowth)
        toast.success('Platform growth data loaded successfully!')
      } catch (err: unknown) {
        console.error('Error fetching platform growth:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        toast.error('Failed to load platform growth data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Custom tooltip formatter for better readability
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
    }>;
    label?: string;
  }
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white dark:bg-gray-800 min-w-[300px] border-0">
      <CardHeader>
        <CardTitle>Platform Growth</CardTitle>
        <CardDescription>Member and library growth over the past 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton className="h-full w-full rounded-md" />
          ) : error ? (
            <div className="text-sm text-destructive">Unable to display chart: {error}. Please try again later.</div>
          ) : data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No data available for the selected period.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  allowDecimals={false}
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="libraries"
                  fill="#8884d8"
                  name="Libraries"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="members"
                  fill="#82ca9d"
                  name="Members"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PlatformGrowth
