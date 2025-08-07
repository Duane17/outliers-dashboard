"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { NotificationDetailModal } from "../notifications/notification-detail-modal"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications"

interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead: (id: string, isRead: boolean) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationDropdownProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const recentNotifications = notifications
    .filter((n) => !n.isRead)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 2)

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    setIsOpen(false)
    if (!notification.isRead) {
      onMarkAsRead(notification.id, true)
    }
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative text-gray-700 hover:bg-gray-100 transition-all duration-200",
              unreadCount > 0 && "hover:text-[#22D3A6]"
            )}
          >
            <Bell className="h-5 w-5 transition-all duration-200" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-[#22D3A6] text-white text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 bg-white border border-gray-200 shadow-xl text-gray-800 p-0"
          align="end"
          sideOffset={8}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#22D3A6] hover:text-[#22D3A6]/80 h-auto p-1"
                onClick={onMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="p-2 space-y-1">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleViewNotification(notification)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-100",
                      notification.isRead
                        ? "border-gray-200 bg-gray-50"
                        : "border-[#3A6EFF]/30 bg-[#3A6EFF]/5"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#3A6EFF] rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "font-medium text-sm truncate",
                            notification.isRead ? "text-gray-600" : "text-gray-900"
                          )}
                        >
                          {notification.title}
                        </h4>
                        <p
                          className={cn(
                            "text-xs mt-1 line-clamp-2",
                            notification.isRead ? "text-gray-500" : "text-gray-600"
                          )}
                        >
                          {notification.summary}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(notification.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No unread notifications</p>
              </div>
            )}
          </div>

          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem asChild>
            <Link
              href="/notifications"
              className="flex items-center px-3 py-2 text-sm text-[#3A6EFF] hover:bg-[#3A6EFF]/10 transition-colors rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View all notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedNotification(null)
        }}
        onMarkAsRead={onMarkAsRead}
      />
    </>
  )
}
