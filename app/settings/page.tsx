"use client"

import { useState } from "react"
import { TopNavigation } from "@/components/layout/top-navigation"
import { SidebarNavigation } from "@/components/layout/sidebar-navigation"
import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation"
import { AccountSettingsManagement } from "@/components/settings/account-settings-management"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Settings", active: true },
  ]

  return (
    <div
      className="min-h-screen bg-white text-slate-900 font-sans"
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      }}
    >
      {/* Top Navigation (fixed header) */}
      <TopNavigation onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar Navigation */}
      <SidebarNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="lg:pl-64 pt-16 bg-white">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>

          {/* Page-specific content */}
          <AccountSettingsManagement />
        </div>
      </main>
    </div>
  )
}
