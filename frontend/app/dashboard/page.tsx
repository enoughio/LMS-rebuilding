"use client"
import Approvals from "@/components/dashboard/sa/approval"
import TopLibraries from "@/components/dashboard/sa/topLibraries"
import Revenue from "@/components/dashboard/sa/revenue"
import PlatformGrowth from "@/components/dashboard/sa/platformGrowth"
import PlatformStats from "@/components/dashboard/sa/platformStats"


export default function SuperAdminDashboardPage() {

  return (
    <div className="space-y-6 w-[75vw]  py-10 px-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the super admin dashboard. Here&apos;s an overview of the platform.
        </p>
      </div>

      {/* Platform Stats */}
      <div >
          <PlatformStats />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Platform Growth */}
        <PlatformGrowth />

        {/* Revenue Breakdown */}
        <Revenue />
        
    
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
 

        <TopLibraries />

        {/* System Status */}
          {/* <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform health and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-600 dark:text-green-400">All Systems Operational</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Last checked {mockDashboardData.systemStatus.lastChecked}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Server Resources</h3>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{mockDashboardData.systemStatus.resources.cpu}%</span>
                    </div>
                    <Progress value={mockDashboardData.systemStatus.resources.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{mockDashboardData.systemStatus.resources.memory}%</span>
                    </div>
                    <Progress value={mockDashboardData.systemStatus.resources.memory} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>{mockDashboardData.systemStatus.resources.storage}%</span>
                    </div>
                    <Progress value={mockDashboardData.systemStatus.resources.storage} className="h-2" />
                  </div>
                </div>

                <div className="rounded-lg bg-green-100 p-4 dark:bg-green-900/30">
                  <h3 className="font-medium text-green-600 dark:text-green-400">Database Maintenance</h3>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">
                    Scheduled maintenance completed on {mockDashboardData.systemStatus.maintenance.date}
                  </p>
                  <Badge
                    variant="outline"
                    className="mt-2 bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                  >
                    {mockDashboardData.systemStatus.maintenance.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View system setting
              </Button>
            </CardFooter>
          </Card> */}
      <Approvals />
      </div>

    </div>
  )
}