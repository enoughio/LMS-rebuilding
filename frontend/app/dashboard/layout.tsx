import type React from "react";
import { DashboardSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
        <DashboardSidebar />     
      <div className="flex-1 overflow-auto">
        <main className="w-full px-6">{children}</main>
      </div>
    </div>
  );
}
