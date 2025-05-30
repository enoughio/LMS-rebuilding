import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function MemberDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardSidebar>{children}</DashboardSidebar>
}
