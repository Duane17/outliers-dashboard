"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Plus,
  Users,
  ChevronUp,
  ChevronDown,
  Calendar,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CollaborationCreateModal } from "./collaboration-create-modal"
import { CollaborationDetailPanel } from "./collaboration-detail-panel"
import { cn } from "@/lib/utils"

interface Collaboration {
  id: string
  name: string
  description: string
  members: number
  status: string
  lastActivity: string
  participants: any[]
  datasets: any[]
  purpose: string
}

export function CollaborationManagement() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: "1",
      name: "Customer Segmentation Study",
      description: "Joint analysis of customer behavior patterns across multiple datasets",
      members: 4,
      status: "active",
      lastActivity: "2024-01-15T14:30:00Z",
      purpose: "Market Research",
      participants: [
        { email: "sarah@datacorp.com", status: "accepted", accessLevel: "compute" },
        { email: "mike@research.edu", status: "accepted", accessLevel: "read" },
        { email: "anna@techflow.com", status: "pending", accessLevel: "read" },
      ],
      datasets: [
        { name: "Customer Behavior Analysis", type: "CSV", smpcReady: true },
        { name: "Market Research Data", type: "XLSX", smpcReady: true },
      ],
    },
    {
      id: "2",
      name: "Revenue Optimization Analysis",
      description: "Collaborative study on revenue optimization strategies",
      members: 3,
      status: "pending",
      lastActivity: "2024-01-14T09:15:00Z",
      purpose: "Financial Analysis",
      participants: [
        { email: "john@finance.com", status: "invited", accessLevel: "manage" },
        { email: "lisa@analytics.org", status: "pending", accessLevel: "compute" },
      ],
      datasets: [{ name: "Sales Performance Q4", type: "JSON", smpcReady: false }],
    },
    {
      id: "3",
      name: "Healthcare Data Insights",
      description: "Privacy-preserving analysis of healthcare outcomes",
      members: 6,
      status: "completed",
      lastActivity: "2024-01-10T16:45:00Z",
      purpose: "Healthcare Research",
      participants: [
        { email: "dr.smith@hospital.org", status: "accepted", accessLevel: "manage" },
        { email: "researcher@uni.edu", status: "accepted", accessLevel: "compute" },
        { email: "analyst@health.gov", status: "accepted", accessLevel: "read" },
      ],
      datasets: [
        { name: "Patient Outcomes Data", type: "CSV", smpcReady: true },
        { name: "Treatment Effectiveness", type: "XLSX", smpcReady: true },
      ],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sortField, setSortField] = useState<keyof Collaboration>("lastActivity")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCollaboration, setSelectedCollaboration] = useState<Collaboration | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)

  const filteredCollaborations = useMemo(() => {
    const filtered = collaborations.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
    filtered.sort((a, b) => {
      const aVal = a[sortField], bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }
      return 0
    })
    return filtered
  }, [collaborations, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: keyof Collaboration) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleCollaborationClick = (c: Collaboration) => {
    setSelectedCollaboration(c)
    setShowDetailPanel(true)
  }

  const handleCollaborationCreate = (newC: Collaboration) =>
    setCollaborations([newC, ...collaborations])

  const handleCollaborationUpdate = (updated: Collaboration) => {
    setCollaborations(collaborations.map((c) => (c.id === updated.id ? updated : c)))
    setSelectedCollaboration(updated)
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-200"
      case "active":
        return "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      case "completed":
        return "bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
      case "revoked":
        return "bg-red-50 text-red-600 border-red-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const SortIcon = ({ field }: { field: keyof Collaboration }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 opacity-0" />
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-[#22D3A6]" />
    ) : (
      <ChevronDown className="h-4 w-4 text-[#22D3A6]" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Collaboration Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage secure data collaborations and SMPC computations
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] hover:from-[#3A6EFF]/90 hover:to-[#22D3A6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Collaboration
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/90 border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search collaborations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-300 text-gray-900 focus:border-[#3A6EFF]"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-900 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="revoked">Revoked</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {(searchTerm || statusFilter) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-600">
                  ×
                </button>
              </Badge>
            )}
            {statusFilter && (
              <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("")} className="ml-1 hover:text-red-600">
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Collaborations Table */}
      <div className="bg-white/90 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Collaboration Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Members</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Purpose</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Status</span>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("lastActivity")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Last Activity
                    <SortIcon field="lastActivity" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCollaborations.map((c, idx) => (
                <tr
                  key={c.id}
                  onClick={() => handleCollaborationClick(c)}
                  className={cn(
                    "border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                    idx % 2 === 0 ? "bg-gray-50" : "bg-transparent"
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {c.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {c.participants.slice(0, 3).map((p, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="bg-[#3A6EFF] text-white text-xs">
                              {p.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">+{c.members - 3}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="bg-gray-100 text-gray-700">{c.purpose}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={cn("transition-all duration-200", getStatusColor(c.status))}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{formatDate(c.lastActivity)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCollaborationClick(c)
                      }}
                      className="text-gray-500 hover:text-[#22D3A6]"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCollaborations.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No collaborations found matching your criteria
            </p>
          </div>
        )}
      </div>

      <CollaborationCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCollaborationCreate}
      />

      <CollaborationDetailPanel
        collaboration={selectedCollaboration}
        isOpen={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        onUpdate={handleCollaborationUpdate}
      />
    </div>
  )
}
