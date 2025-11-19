"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Database,
  Users,
  BarChart3,
  Shield,
  User,
  Bell,
  HelpCircle,
  Calculator,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

const navigationItems: NavigationItem[] = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/" },
  { icon: Database,        label: "Datasets",       href: "/datasets" },
  { icon: Users,           label: "Collaborations", href: "/collaborations" },
  { icon: Calculator,      label: "Computations",   href: "/computations" },
  { icon: BarChart3,       label: "Insights",       href: "/insights" },
]

interface SidebarNavigationProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Renders a sidebar navigation menu in light mode.
 * - Uses `usePathname()` to determine the current route.
 * - Highlights the active item with a dynamic left-border indicator.
 * - Shows a semi-transparent mobile overlay when open on small screens.
 */
export function SidebarNavigation({ isOpen, onClose }: SidebarNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r border-gray-200 bg-white/90 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#3A6EFF]/10 text-[#3A6EFF] border-l-2 border-[#3A6EFF]"
                    : "text-gray-700 hover:bg-[#3A6EFF]/10 hover:text-[#22D3A6]"
                )}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-[#3A6EFF]"
                      : hoveredItem === item.href
                      ? "text-[#22D3A6]"
                      : "text-gray-500"
                  )}
                />

                <span className="flex-1">{item.label}</span>

                {hoveredItem === item.href && !isActive && (
                  <div className="absolute inset-0 rounded-lg bg-linear-to-r from-[#3A6EFF]/5 to-[#22D3A6]/5 -z-10" />
                )}

                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#3A6EFF] rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
