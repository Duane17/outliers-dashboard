"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User, LogOut, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationDropdown } from "./notification-dropdown"
import type { Notification } from "@/types/notifications"

interface TopNavigationProps {
  onMenuToggle: () => void
}

export function TopNavigation({ onMenuToggle }: TopNavigationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "collaboration_invite",
      title: "New Collaboration Invite",
      summary: "Dr. Sarah Chen invited you to join Healthcare Analytics Study",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      priority: "medium",
      metadata: { userId: "sarah-chen", collaborationId: "health-study-2024" },
    },
    {
      id: "2",
      type: "insight_ready",
      title: "Computation Complete",
      summary: "Statistical Analysis #47 has finished processing",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      priority: "low",
      metadata: { insightId: "stat-analysis-47" },
    },
    {
      id: "3",
      type: "audit_alert",
      title: "Security Alert",
      summary: "Unusual login activity detected from unknown location",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true,
      priority: "high",
      metadata: { location: "Unknown (VPN)" },
    },
  ])

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 hover:bg-gray-100"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Outliers Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-semibold text-xl text-gray-900 hidden sm:block">Outliers</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteNotification}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="
                  relative h-10 w-10 rounded-full
                  bg-gradient-to-br from-[#3A6EFF] to-[#22D3A6]
                  flex items-center justify-center
                  hover:scale-105 hover:shadow-md
                  transition-transform
                "
              >
                <User className="h-6 w-6 text-white" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 bg-white border border-gray-200 shadow-xl text-gray-800"
              align="end"
            >
              {/* User preview */}
              <div className="flex items-center gap-2 p-2">
                <div
                  className="
                    h-8 w-8 rounded-full
                    bg-gradient-to-br from-[#3A6EFF] to-[#22D3A6]
                    flex items-center justify-center
                    hover:from-[#3A6EFF]/75 hover:to-[#22D3A6]/75
                    transition-colors
                  "
                >
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900">User Name</p>
                  <p className="text-xs text-gray-500">user@email.com</p>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-gray-200" />

              {/* Profile Settings */}
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="
                    group flex items-center px-3 py-2 text-sm text-gray-700
                    transition-all duration-150 ease-in-out
                    hover:bg-gray-100 hover:text-gray-900 hover:pl-4
                  "
                >
                  <User className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>

              {/* Help & Support */}
              <DropdownMenuItem asChild>
                <Link
                  href="/help"
                  className="
                    group flex items-center px-3 py-2 text-sm text-gray-700
                    transition-all duration-150 ease-in-out
                    hover:bg-gray-100 hover:text-gray-900 hover:pl-4
                  "
                >
                  <HelpCircle className="mr-2 h-4 w-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                  Help & Support
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-200" />

              {/* Logout */}
              <DropdownMenuItem
                className="
                  group flex items-center px-3 py-2 text-sm text-red-500
                  transition-all duration-150 ease-in-out
                  hover:bg-red-100 hover:text-red-600 hover:pl-4
                "
              >
                <LogOut className="mr-2 h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
