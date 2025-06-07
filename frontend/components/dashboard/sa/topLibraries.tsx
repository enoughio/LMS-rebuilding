'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LibraryStat {
  name: string;
  location: string;
  revenue: number;
  members: number;
}

const TopLibraries: React.FC = () => {
  const [topLibraries, setTopLibraries] = useState<LibraryStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopLibraries = async () => {
      try {
        const response = await fetch('/api/libraries/top', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch top libraries.';
          try {
            const errorData = await response.json();
            console.error('Error fetching top libraries:', errorData);
            errorMessage = errorData?.message || errorMessage;
          } catch (_) {
            /* swallow JSON parse error */
            console.error('Some Parse Error:', _);
          }
          toast.error(errorMessage);
          setTopLibraries([]);
          return;
        }

        const { data } = await response.json();
        toast.success('Top libraries fetched successfully!');
        setTopLibraries( data.libraries || []);
      } catch (error) {
        toast.error(
          `Network error: ${error instanceof Error ? error : 'Unable to fetch'}`
        );
        setTopLibraries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLibraries();
  }, []);

  // Placeholder skeleton blocks while loading
  const skeletonItems = Array.from({ length: 6 });

  return (
    <Card className='bg-white border-0 rounded-md'>
      <CardHeader>
        <CardTitle>Library Performance</CardTitle>
        <CardDescription>Top performing libraries this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            skeletonItems.map((_, idx) => (
              <Skeleton key={idx} className="h-[72px] rounded-lg " />
            ))
          ) : topLibraries.length > 0 ? (
            topLibraries.map((library, idx) => (
              <div
                key={`${library.name}-${idx}`}
                className="flex items-center justify-between rounded-lg bg-[#F6EDE5] p-4"
              >
                <div>
                  <h3 className="font-medium">{library.name}</h3>
                  <p className="text-sm text-muted-foreground">{library.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{library.revenue.toLocaleString()}</p>
                  {/* Uncomment if you want to display member count */}
                  {/* <p className="text-xs text-muted-foreground">{library.members} members</p> */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No data available.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/dashboard/SUPER_ADMIN/libraries">
            View all libraries
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TopLibraries;
