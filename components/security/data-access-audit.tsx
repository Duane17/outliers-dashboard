"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Calendar,
  User,
  Database,
  Eye,
  Download,
  Play,
  ChevronUp,
  ChevronDown,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AccessEvent {
  id: string
  user: string
  dataset: string
  accessMethod: "read-only" | "computation" | "export"
  timestamp: string
  notes?: string
  ipAddress: string
  userAgent: string
}

interface DataAccessAuditProps {
  className?: string
}

export function DataAccessAudit({ className }: DataAccessAuditProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const [datasetFilter, setDatasetFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")
  const [sortField, setSortField] = useState<keyof AccessEvent>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const accessEvents: AccessEvent[] = [
    {
      id: "access-001",
      user: "Sarah Chen",
      dataset: "Customer Behavior Analysis",
      accessMethod: "computation",
      timestamp: "2024-01-15T14:30:00Z",
      notes: "SMPC correlation analysis with transaction data",
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
    {
      id: "access-002",
      user: "Mike Johnson",
      dataset: "Sales Performance Q4",
      accessMethod: "read-only",
      timestamp: "2024-01-15T13:15:00Z",
      notes: "Dataset review for upcoming analysis",
      ipAddress: "10.0.0.23",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    {
      id: "access-003",
      user: "Anna Rodriguez",
      dataset: "Market Research Data",
      accessMethod: "export",
      timestamp: "2024-01-15T11:45:00Z",
      notes: "Compliance report generation",
      ipAddress: "172.16.0.8",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    },
    {
      id: "access-004",
      user: "David Kim",
      dataset: "User Engagement Metrics",
      accessMethod: "computation",
      timestamp: "2024-01-14T16:20:00Z",
      notes: "Churn prediction model training",
      ipAddress: "192.168.1.67",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
    {
      id: "access-005",
      user: "Lisa Wang",
      dataset: "Transaction History",
      accessMethod: "read-only",
      timestamp: "2024-01-14T09:30:00Z",
      ipAddress: "10.0.0.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  ]

  // Get unique values for filters
  const uniqueUsers = [...new Set(accessEvents.map((event) => event.user))]
  const uniqueDatasets = [...new Set(accessEvents.map((event) => event.dataset))]

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    const filtered = accessEvents.filter((event) => {
      const matchesSearch =
        event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.notes?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesUser = !userFilter || event.user === userFilter
      const matchesDataset = !datasetFilter || event.dataset === datasetFilter
      const matchesMethod = !methodFilter || event.accessMethod === methodFilter

      return matchesSearch && matchesUser && matchesDataset && matchesMethod
    })

    // Sort events
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    return filtered
  }, [accessEvents, searchTerm, userFilter, datasetFilter, methodFilter, sortField, sortDirection])

  const handleSort = (field: keyof AccessEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "read-only":
        return <Eye className="h-4 w-4 text-[#3A6EFF]" />
      case "computation":
        return <Play className="h-4 w-4 text-[#22D3A6]" />
      case "export":
        return <Download className="h-4 w-4 text-yellow-400" />
      default:
        return <FileText className="h-4 w-4 text-slate-400" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "read-only":
        return "bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
      case "computation":
        return "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      case "export":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      default:
        return "bg-slate-600/10 text-slate-300 border-slate-600/20"
    }
  }

  const SortIcon = ({ field }: { field: keyof AccessEvent }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 opacity-0" />
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-[#22D3A6]" />
    ) : (
      <ChevronDown className="h-4 w-4 text-[#22D3A6]" />
    )
  }

  return (
    <Card className={cn("bg-slate-900/50 backdrop-blur-sm border-slate-800/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Eye className="h-5 w-5 text-[#22D3A6]" />
          Data Access Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users, datasets, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-slate-100 focus:border-[#3A6EFF]"
            />
          </div>

          <div className="relative">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="appearance-none bg-slate-800/50 border border-slate-600 rounded-md px-4 py-2 pr-8 text-slate-100 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
            <User className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={datasetFilter}
              onChange={(e) => setDatasetFilter(e.target.value)}
              className="appearance-none bg-slate-800/50 border border-slate-600 rounded-md px-4 py-2 pr-8 text-slate-100 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Datasets</option>
              {uniqueDatasets.map((dataset) => (
                <option key={dataset} value={dataset}>
                  {dataset}
                </option>
              ))}
            </select>
            <Database className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="appearance-none bg-slate-800/50 border border-slate-600 rounded-md px-4 py-2 pr-8 text-slate-100 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Methods</option>
              <option value="read-only">Read Only</option>
              <option value="computation">Computation</option>
              <option value="export">Export</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || userFilter || datasetFilter || methodFilter) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <Badge variant="secondary" className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-400">
                  ×
                </button>
              </Badge>
            )}
            {userFilter && (
              <Badge variant="secondary" className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                User: {userFilter}
                <button onClick={() => setUserFilter("")} className="ml-1 hover:text-red-400">
                  ×
                </button>
              </Badge>
            )}
            {datasetFilter && (
              <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                Dataset: {datasetFilter}
                <button onClick={() => setDatasetFilter("")} className="ml-1 hover:text-red-400">
                  ×
                </button>
              </Badge>
            )}
            {methodFilter && (
              <Badge variant="secondary" className="bg-slate-600/10 text-slate-300 border-slate-600/20">
                Method: {methodFilter}
                <button onClick={() => setMethodFilter("")} className="ml-1 hover:text-red-400">
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Access Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("user")}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    User
                    <SortIcon field="user" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("dataset")}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Dataset
                    <SortIcon field="dataset" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-slate-300 font-medium">Access Method</span>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("timestamp")}
                    className="flex items-center gap-2 text-slate-300 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Timestamp
                    <SortIcon field="timestamp" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-slate-300 font-medium">Notes</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr
                  key={event.id}
                  className={cn(
                    "border-b border-slate-700/30 hover:bg-slate-800/30 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                    index % 2 === 0 ? "bg-slate-800/10" : "bg-transparent",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-100">{event.user}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20">
                      {event.dataset}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(event.accessMethod)}
                      <Badge variant="secondary" className={getMethodColor(event.accessMethod)}>
                        {event.accessMethod}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-mono">{formatDate(event.timestamp)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-400">{event.notes || "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No access events found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
