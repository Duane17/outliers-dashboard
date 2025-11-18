"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/layout/top-navigation"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { BreadcrumbNavigation } from "../components/layout/breadcrumb-navigation"
import { DashboardContent } from "../components/home/dashboard-content"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbItems = [{ label: "Dashboard", active: true }]

  return (
    <div
      className="min-h-screen bg-white text-gray-900 font-sans"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      }}
    >
      {/* Top Navigation */}
      <TopNavigation onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <SidebarNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">
              Here's what's happening with your data collaboration projects today.
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardContent />
        </div>
      </main>
    </div>
  )
}
