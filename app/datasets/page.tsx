"use client"

import { useState } from "react"
import { TopNavigation } from "../../components/layout/top-navigation"
import { SidebarNavigation } from "../../components/layout/sidebar-navigation"
import { BreadcrumbNavigation } from "../../components/layout/breadcrumb-navigation"
import { DatasetManagement } from "../../components/datasets/dataset-management"

export default function DatasetsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Datasets", active: true },
  ]

  return (
    <div
      className="min-h-screen bg-white font-sans text-gray-900"
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

          {/* Dataset Management */}
          <DatasetManagement />
        </div>
      </main>
    </div>
  )
}
