"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/layout/top-navigation"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation"
import { NotificationsCenter } from "@/components/notifications/notifications-center"

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Notifications", href: "/notifications", current: true },
  ]

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-sans"
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
      <main className="lg:pl-64 pt-16 bg-white">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>

          {/* Notifications Center */}
          <NotificationsCenter />
        </div>
      </main>
    </div>
  )
}
