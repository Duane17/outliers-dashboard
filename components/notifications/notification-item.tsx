"use client"

import { useState } from "react"
import {
  Users,
  Database,
  BarChart3,
  Shield,
  Bell,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string, isRead: boolean) => void
  onDelete: (id: string) => void
  onView: (notification: Notification) => void
}

const notificationIcons = {
  collaboration_invite: Users,
  dataset_access: Database,
  insight_ready: BarChart3,
  audit_alert: Shield,
  system_update: Bell,
}

const notificationColors = {
  collaboration_invite: "text-emerald-600",
  dataset_access: "text-[#3A6EFF]",
  insight_ready: "text-purple-400",
  audit_alert: "text-red-400",
  system_update: "text-yellow-400",
}

const priorityBorders = {
  low: "border-slate-300",
  medium: "border-[#3A6EFF]/50",
  high: "border-red-400/50",
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onView,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = notificationIcons[notification.type]

  const formatTimestamp = (date: Date) => {
    const now = Date.now()
    const diff = now - date.getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "Just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    return `${d}d ago`
  }

  return (
    <div
      className={cn(
        "group relative p-4 rounded-lg border bg-white shadow-sm transition cursor-pointer",
        "hover:bg-slate-50",
        isHovered && "shadow-lg",
        notification.isRead
          ? "border-slate-200"
          : "border-[#3A6EFF]/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(notification)}
    >
      {/* Unread pulse */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#3A6EFF] rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 p-2 rounded-lg",
            notification.isRead ? "bg-slate-100" : "bg-[#3A6EFF]/10",
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              notification.isRead
                ? "text-slate-400"
                : notificationColors[notification.type],
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-medium text-sm",
                notification.isRead ? "text-slate-700" : "text-slate-900",
              )}
            >
              {notification.title}
            </h3>
            {notification.priority === "high" && (
              <Badge className="bg-red-50 text-red-400 border-red-200 text-xs">
                High
              </Badge>
            )}
          </div>

          <p
            className={cn(
              "text-sm mt-1 line-clamp-2",
              notification.isRead ? "text-slate-500" : "text-slate-600",
            )}
          >
            {notification.summary}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              {formatTimestamp(notification.timestamp)}
            </div>

            {/* Action buttons */}
            <div
              className={cn(
                "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                isHovered && "opacity-100",
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                onClick={e => {
                  e.stopPropagation()
                  onMarkAsRead(notification.id, !notification.isRead)
                }}
              >
                {notification.isRead ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-400"
                onClick={e => {
                  e.stopPropagation()
                  onDelete(notification.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-slate-100 hover:text-[#3A6EFF]"
                onClick={e => {
                  e.stopPropagation()
                  onView(notification)
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hover highlight */}
      {isHovered && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3A6EFF]/5 to-[#22D3A6]/5 -z-10" />
      )}
    </div>
  )
}
