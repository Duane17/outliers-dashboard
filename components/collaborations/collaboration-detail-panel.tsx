"use client"

import { useState } from "react"
import {
  X,
  MessageCircle,
  Clock,
  Users,
  Database,
  Play,
  Send,
  Pin,
  Paperclip,
  UserPlus,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SMPCJobWizard } from "./smpc-job-wizard"
import { cn } from "@/lib/utils"

interface Collaboration {
  id: string
  name: string
  description: string
  members: number
  status: string
  lastActivity: string
  participants: { email: string; status: string; accessLevel: string }[]
  datasets: { name: string; type: string; smpcReady?: boolean }[]
}

interface CollaborationDetailPanelProps {
  collaboration: Collaboration | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (collaboration: Collaboration) => void
}

interface Message {
  id: string
  author: string
  content: string
  timestamp: string
  pinned?: boolean
}

interface ActivityEvent {
  id: string
  description: string
  timestamp: string
  user: string
  icon: any
  color: string
}

export function CollaborationDetailPanel({
  collaboration,
  isOpen,
  onClose,
  onUpdate,
}: CollaborationDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "smpc" | "messages" | "activity">(
    "overview"
  )
  const [newMessage, setNewMessage] = useState("")
  const [showSMPCWizard, setShowSMPCWizard] = useState(false)

  // ---- MOCK DATA ----
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", author: "John Doe", content: "Welcome to the collaboration!", timestamp: "2024-01-15T10:30:00Z" },
    { id: "2", author: "Sarah Chen", content: "Market research data uploaded.", timestamp: "2024-01-15T11:15:00Z", pinned: true },
    { id: "3", author: "Mike Johnson", content: "Shall we begin correlation analysis?", timestamp: "2024-01-15T14:20:00Z" },
  ])
  const activityEvents: ActivityEvent[] = [
    { id: "1", description: "Collaboration created", timestamp: "2024-01-15T09:00:00Z", user: "John Doe", icon: Users, color: "text-blue-600" },
    { id: "2", description: "Sarah Chen joined", timestamp: "2024-01-15T09:30:00Z", user: "Sarah Chen", icon: UserPlus, color: "text-green-600" },
    { id: "3", description: "Dataset added", timestamp: "2024-01-15T11:15:00Z", user: "Sarah Chen", icon: Database, color: "text-blue-600" },
    { id: "4", description: "SMPC job launched", timestamp: "2024-01-15T15:45:00Z", user: "Mike Johnson", icon: Play, color: "text-green-600" },
  ]
  const [smpcJobs] = useState([
    { id: "1", name: "Customer Correlation", status: "completed", progress: 100, createdAt: "2024-01-15T15:45:00Z", completedAt: "2024-01-15T16:30:00Z" },
    { id: "2", name: "Revenue Statistics", status: "running", progress: 65, createdAt: "2024-01-16T09:15:00Z" },
  ])
  // ---------------------

  if (!collaboration || !isOpen) return null

  // Helpers
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "active":
        return "bg-green-100 text-green-600 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "revoked":
        return "bg-red-100 text-red-600 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getJobIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "running":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  // Message actions
  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), author: "You", content: newMessage, timestamp: new Date().toISOString() },
    ])
    setNewMessage("")
  }
  const togglePin = (id: string) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)))

  // Tabs definition
  const tabs: { id: typeof activeTab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "smpc", label: "SMPC Jobs", icon: Play },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "activity", label: "Activity", icon: Clock },
  ]

  return (
    <>
      {/* Panel Container */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-white border-l shadow-xl flex flex-col border-gray-200 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{collaboration.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={getStatusColor(collaboration.status)}>{collaboration.status}</Badge>
              <span className="text-sm text-gray-600">{collaboration.members} members</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            {tabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2",
                    active
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Description */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{collaboration.description}</p>
              </section>

              {/* Participants */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Participants</h3>
                <div className="space-y-3 max-h-[25vh] overflow-y-auto">
                  {collaboration.participants.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {p.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.email}</p>
                          <Badge
                            className={cn(
                              p.status === "accepted"
                                ? "bg-green-100 text-green-600 border-green-200"
                                : "bg-yellow-100 text-yellow-600 border-yellow-200"
                            )}
                          >
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        {p.accessLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>

              {/* Datasets */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shared Datasets</h3>
                <div className="space-y-3 max-h-[25vh] overflow-y-auto">
                  {collaboration.datasets.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Database className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.name}</p>
                          <p className="text-xs text-gray-600">{d.type}</p>
                        </div>
                      </div>
                      {d.smpcReady && (
                        <Badge className="bg-green-100 text-green-600 border-green-200 text-xs">
                          SMPC Ready
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* SMPC Jobs */}
          {activeTab === "smpc" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">SMPC Computations</h3>
                <Button
                  onClick={() => setShowSMPCWizard(true)}
                  className="bg-gradient-to-r from-blue-500 to-green-500 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {smpcJobs.map((job) => (
                  <Card key={job.id} className="bg-white border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-gray-900 text-base">{job.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getJobIcon(job.status)}
                          <Badge
                            className={cn(
                              job.status === "completed"
                                ? "bg-green-100 text-green-600 border-green-200"
                                : job.status === "running"
                                ? "bg-blue-100 text-blue-600 border-blue-200"
                                : "bg-red-100 text-red-600 border-red-200"
                            )}
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {job.status === "running" && (
                          <>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-800">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full"
                                style={{ width: `${job.progress}%`, background: "linear-gradient(to right, #3A6EFF, #22D3A6)" }}
                              />
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Created</span>
                          <span className="text-gray-800">{formatDate(job.createdAt)}</span>
                        </div>
                        {job.completedAt && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Completed</span>
                            <span className="text-gray-800">{formatDate(job.completedAt)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeTab === "messages" && (
            <div className="flex flex-col space-y-4">
              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      msg.pinned ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {msg.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{msg.author}</p>
                            <span className="text-xs text-gray-600">{formatDate(msg.timestamp)}</span>
                            {msg.pinned && <Pin className="h-3 w-3 text-green-600" />}
                          </div>
                          <p className="text-gray-700 mt-1">{msg.content}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePin(msg.id)}
                        className="text-gray-500 hover:text-green-600"
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message…"
                  className="flex-1 bg-white border-gray-300 text-gray-900 focus:border-green-500"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-green-500 text-white">
                  <Send className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-500">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Activity */}
          {activeTab === "activity" && (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900">Activity Timeline</h3>
              <div className="space-y-4">
                {activityEvents.map((evt, idx) => (
                  <div key={evt.id} className="flex items-start gap-4">
                    <div className="relative">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white",
                          evt.color === "text-blue-600"
                            ? "border-blue-200"
                            : "border-green-200"
                        )}
                      >
                        <evt.icon className={cn("h-5 w-5", evt.color)} />
                      </div>
                      {idx < activityEvents.length - 1 && (
                        <div className="absolute top-10 left-1/2 w-px h-8 bg-gray-200 transform -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{evt.description}</p>
                        <span className="text-xs text-gray-600">{formatDate(evt.timestamp)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">by {evt.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SMPC Wizard */}
      <SMPCJobWizard
        isOpen={showSMPCWizard}
        onClose={() => setShowSMPCWizard(false)}
        collaborationId={collaboration.id}
        onLaunch={(job) => console.log("Launched", job)}
      />
    </>
  )
}
