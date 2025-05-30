import type React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebar>
      <div>{children}</div>
    </DashboardSidebar>
  );
}
