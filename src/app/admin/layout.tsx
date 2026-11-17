import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "KabaadSe Ops | Logistics & Rates Console",
  description: "Production operations management console for doorstep scrap pickup logistics and live rate cards.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-emerald-600 selection:text-white antialiased transition-colors duration-200">
      {/* Shared Admin Sidebar Shell */}
      <AdminSidebar />

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 bg-slate-50 dark:bg-[#0B0F19] overflow-y-auto transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}
