"use client"

import { useState } from "react"
import { TopNavigation } from "../../components/layout/top-navigation"
import { SidebarNavigation } from "../../components/layout/sidebar-navigation"
import { BreadcrumbNavigation } from "../../components/layout/breadcrumb-navigation"
import { ComputationsPage } from "@/components/computations/computations-page"

export default function Computations() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Computations", active: true },
  ]

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
      <main className="lg:pl-64 pt-16 bg-gray-50">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>

          {/* Computations Page */}
          <ComputationsPage />
        </div>
      </main>
    </div>
  )
}
