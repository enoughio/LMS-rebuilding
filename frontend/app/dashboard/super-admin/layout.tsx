import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function SuperAdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardSidebar>{children}</DashboardSidebar>
}
