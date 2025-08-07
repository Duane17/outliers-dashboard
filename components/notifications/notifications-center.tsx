"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  Filter,
  Search,
  CheckCheck,
  Trash2,
  RefreshCw,
  Users,
  Database,
  BarChart3,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { NotificationItem } from "./notification-item"
import { NotificationDetailModal } from "./notification-detail-modal"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/notifications"

// -- Sample data & filter definitions ------------------------------------------

const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "collaboration_invite",
    title: "New Collaboration Invite",
    summary:
      "Dr. Sarah Chen invited you to join Healthcare Analytics Study for secure multi-party computation on patient data.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    priority: "medium",
    metadata: { userId: "sarah-chen", collaborationId: "health-study-2024" },
  },
  {
    id: "2",
    type: "insight_ready",
    title: "Computation Complete",
    summary: "Statistical Analysis #47 has finished processing. Results are now available for review.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    priority: "low",
    metadata: { insightId: "stat-analysis-47" },
  },
  {
    id: "3",
    type: "audit_alert",
    title: "Security Alert",
    summary: "Unusual login activity detected from unknown location. Please review your account security.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true,
    priority: "high",
    metadata: { location: "Unknown (VPN)" },
  },
  {
    id: "4",
    type: "dataset_access",
    title: "New Dataset Available",
    summary: "Customer Behavior Q4 2024 dataset has been shared with you and is ready for analysis.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isRead: false,
    priority: "medium",
    metadata: { datasetId: "customer-behavior-q4-2024" },
  },
  {
    id: "5",
    type: "system_update",
    title: "System Maintenance Complete",
    summary: "Scheduled maintenance has been completed. All services are now fully operational.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    priority: "low",
    metadata: {},
  },
  {
    id: "6",
    type: "collaboration_invite",
    title: "Research Partnership Request",
    summary: "MIT Research Lab has requested to collaborate on your Financial Risk Assessment project.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false,
    priority: "high",
    metadata: { userId: "mit-research", collaborationId: "financial-risk-2024" },
  },
]

const notificationTypeFilters = [
  { value: "all", label: "All Types", icon: Bell },
  { value: "collaboration_invite", label: "Collaborations", icon: Users },
  { value: "dataset_access", label: "Datasets", icon: Database },
  { value: "insight_ready", label: "Insights", icon: BarChart3 },
  { value: "audit_alert", label: "Security", icon: Shield },
  { value: "system_update", label: "System", icon: Bell },
]

// -- Component -----------------------------------------------------------------

export function NotificationsCenter() {
  // State for notifications, filters, modals, and loading indicators
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(sampleNotifications)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Compute counts for header
  const unreadCount = notifications.filter(n => !n.isRead).length
  const totalCount = notifications.length

  // Re-filter and sort whenever notifications or filters change
  useEffect(() => {
    let list = notifications

    // 1) Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      )
    }

    // 2) Type filter
    if (typeFilter !== "all") {
      list = list.filter(n => n.type === typeFilter)
    }

    // 3) Read/unread filter
    if (statusFilter === "unread") list = list.filter(n => !n.isRead)
    else if (statusFilter === "read") list = list.filter(n => n.isRead)

    // 4) Sort newest first
    list = [...list].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setFilteredNotifications(list)
  }, [notifications, searchQuery, typeFilter, statusFilter])

  // Handlers to mutate notification state
  const handleMarkAsRead = (id: string, isRead: boolean) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead } : n))
  }
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  const handleDelete = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id))
  const handleDeleteAll = () => setNotifications([])
  const handleView = (n: Notification) => {
    setSelectedNotification(n)
    setIsModalOpen(true)
    if (!n.isRead) handleMarkAsRead(n.id, true)
  }
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(res => setTimeout(res, 1000))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Header: Icon + title + counts */}
        <header className="flex items-center gap-4">
          <div className="p-2 bg-[#3A6EFF]/10 rounded-lg">
            <Bell className="h-6 w-6 text-[#3A6EFF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-slate-600">
              {unreadCount > 0
                ? <><span className="font-medium text-[#22D3A6]">{unreadCount} unread</span> of {totalCount}  notifications</>
                : `All ${totalCount} read`}
            </p>
          </div>
        </header>

        {/* Controls: Search, filters, actions */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">

            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type & status selects */}
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypeFilters.map(f => (
                    <SelectItem key={f.value} value={f.value}>
                      <div className="flex items-center gap-2">
                        <f.icon className="h-4 w-4" /> {f.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh & bulk actions */}
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" /> Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                    <CheckCheck className="h-4 w-4 mr-2" /> Mark All as Read
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDeleteAll} disabled={totalCount === 0} className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </section>

        {/* List or empty state */}
        <section className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "No matching notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-sm text-slate-500">
                {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search"
                  : "Notifications will appear here when they arrive"}
              </p>
            </div>
          )}
        </section>

        {/* Load more button */}
        {filteredNotifications.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              Load More Notifications
            </Button>
          </div>
        )}
      </div>

      {/* Detail modal for a selected notification */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMarkAsRead={handleMarkAsRead}
      />
    </div>
  )
}
