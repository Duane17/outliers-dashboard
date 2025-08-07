"use client"

import { X, Clock, Database, Users, BarChart3, Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications"

interface NotificationDetailModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: (id: string, isRead: boolean) => void
}

const notificationIcons = {
  collaboration_invite: Users,
  dataset_access: Database,
  insight_ready: BarChart3,
  audit_alert: Shield,
  system_update: Bell,
}

const notificationColors = {
  collaboration_invite: "text-[#22D3A6]",
  dataset_access: "text-[#3A6EFF]",
  insight_ready: "text-purple-500",
  audit_alert: "text-red-500",
  system_update: "text-yellow-500",
}

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}: NotificationDetailModalProps) {
  if (!notification) return null

  const Icon = notificationIcons[notification.type]

  const getDetailedContent = (n: Notification) => {
    switch (n.type) {
      case "collaboration_invite":
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              You've been invited to collaborate on a secure multi-party computation project.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Project:</span>
                <span className="text-gray-800">Healthcare Analytics Study</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Invited by:</span>
                <span className="text-gray-800">Dr. Sarah Chen</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="text-gray-800">Data Contributor</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-[#22D3A6] hover:bg-[#22D3A6]/90 text-white">
                Accept Invitation
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-600 bg-transparent">
                Decline
              </Button>
            </div>
          </div>
        )
      case "dataset_access":
        return (
          <div className="space-y-4">
            <p className="text-gray-700">A new dataset has been shared with you and is ready for analysis.</p>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Dataset:</span>
                <span className="text-gray-800">Customer Behavior Q4 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span className="text-gray-800">2.3 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Access Level:</span>
                <span className="text-gray-800">Read & Compute</span>
              </div>
            </div>
            <Button className="bg-[#3A6EFF] hover:bg-[#3A6EFF]/90 text-white">
              View Dataset
            </Button>
          </div>
        )
      case "insight_ready":
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              Your SMPC computation has completed successfully. Results are now available.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Computation:</span>
                <span className="text-gray-800">Statistical Analysis #47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="text-gray-800">2h 34m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Participants:</span>
                <span className="text-gray-800">5 organizations</span>
              </div>
            </div>
            <Button className="bg-purple-500 hover:bg-purple-500/90 text-white">
              View Results
            </Button>
          </div>
        )
      case "audit_alert":
        return (
          <div className="space-y-4">
            <p className="text-gray-700">Unusual access pattern detected. Please review your account activity.</p>
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Event:</span>
                <span className="text-red-500">Multiple login attempts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="text-red-500">Unknown (VPN detected)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="text-red-500">2:34 AM UTC</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-red-500 hover:bg-red-500/90 text-white">
                Secure Account
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-600 bg-transparent">
                Review Activity
              </Button>
            </div>
          </div>
        )
      default:
        return <p className="text-gray-700">{notification.summary}</p>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
            w-full max-w-lg bg-white border border-gray-200
            rounded-xl shadow-2xl
          "
        >
          <DialogHeader>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    notification.isRead ? "bg-gray-100" : "bg-[#3A6EFF]/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      notification.isRead
                        ? "text-gray-400"
                        : notificationColors[notification.type]
                    )}
                  />
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {notification.timestamp.toLocaleString()}
                    </span>
                    {notification.priority === "high" && (
                      <Badge className="bg-red-100 text-red-500 border border-red-200 text-xs">
                        High Priority
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">{getDetailedContent(notification)}</div>

          <DialogFooter className="flex items-center justify-between p-6 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-[#22D3A6]"
              onClick={() => onMarkAsRead(notification.id, !notification.isRead)}
            >
              {notification.isRead ? "Mark as Unread" : "Mark as Read"}
            </Button>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 bg-transparent"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
