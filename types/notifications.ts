export interface Notification {
  id: string
  type: "collaboration_invite" | "dataset_access" | "insight_ready" | "audit_alert" | "system_update"
  title: string
  summary: string
  timestamp: Date
  isRead: boolean
  priority: "low" | "medium" | "high"
  metadata?: {
    collaborationId?: string
    datasetId?: string
    insightId?: string
    userId?: string
    [key: string]: any
  }
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
}
