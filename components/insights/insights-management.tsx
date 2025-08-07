"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Flag,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronUp,
  ChevronDown,
  Zap,
  Database,
  GitCompare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { InsightDetailModal } from "./insight-detail-modal"
import { InsightComparisonModal } from "./insight-comparison-modal"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                               Types / mocks                               */
/* -------------------------------------------------------------------------- */
interface Insight {
  id: string
  title: string
  dateGenerated: string
  sourceDatasets: string[]
  computationType: string
  status: string
  data: any[]
  metadata: any
  analyst?: string
  description?: string
}

export function InsightsManagement() {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      title: "Customer Lifetime Value Trends",
      dateGenerated: "2024-01-15T14:30:00Z",
      sourceDatasets: ["Customer Behavior Analysis", "Transaction History"],
      computationType: "trend analysis",
      status: "success",
      data: [],
      metadata: {},
      analyst: "Sarah Chen",
      description: "Analysis of customer lifetime value patterns across different segments",
    },
    {
      id: "2",
      title: "Revenue Correlation Analysis",
      dateGenerated: "2024-01-14T09:15:00Z",
      sourceDatasets: ["Sales Performance Q4", "Market Research Data"],
      computationType: "correlation",
      status: "flagged",
      data: [],
      metadata: {},
      analyst: "Mike Johnson",
      description: "Correlation between marketing spend and revenue generation",
    },
    {
      id: "3",
      title: "Market Segment Distribution",
      dateGenerated: "2024-01-13T16:45:00Z",
      sourceDatasets: ["Customer Demographics", "Purchase Patterns"],
      computationType: "distribution",
      status: "success",
      data: [],
      metadata: {},
      analyst: "Anna Rodriguez",
      description: "Distribution analysis of customer segments by demographics",
    },
    {
      id: "4",
      title: "Churn Prediction Model",
      dateGenerated: "2024-01-12T11:20:00Z",
      sourceDatasets: ["User Engagement Metrics", "Support Tickets"],
      computationType: "machine learning",
      status: "needs review",
      data: [],
      metadata: {},
      analyst: "David Kim",
      description: "Predictive model for customer churn based on engagement patterns",
    },
    {
      id: "5",
      title: "Seasonal Sales Patterns",
      dateGenerated: "2024-01-11T13:10:00Z",
      sourceDatasets: ["Historical Sales Data", "Calendar Events"],
      computationType: "trend analysis",
      status: "success",
      data: [],
      metadata: {},
      analyst: "Lisa Wang",
      description: "Seasonal trends in sales performance across product categories",
    },
  ])

  /* ---------------------------------------------------------------------- */
  /*                                State                                   */
  /* ---------------------------------------------------------------------- */
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [computationTypeFilter, setComputationTypeFilter] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [sortField, setSortField] = useState<keyof Insight>("dateGenerated")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([])
  const [showComparisonModal, setShowComparisonModal] = useState(false)

  /* ---------------------------------------------------------------------- */
  /*                          Helpers / formatters                          */
  /* ---------------------------------------------------------------------- */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-50 text-emerald-600 border-emerald-200"
      case "flagged":
        return "bg-red-50 text-red-600 border-red-200"
      case "needs review":
        return "bg-yellow-50 text-yellow-600 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-500 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "flagged":
        return <Flag className="h-4 w-4" />
      case "needs review":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getComputationIcon = (type: string) => {
    switch (type) {
      case "trend analysis":
        return <TrendingUp className="h-4 w-4 text-[#3A6EFF]" />
      case "correlation":
        return <BarChart3 className="h-4 w-4 text-emerald-600" />
      case "distribution":
        return <PieChart className="h-4 w-4 text-yellow-500" />
      case "machine learning":
        return <Zap className="h-4 w-4 text-purple-500" />
      default:
        return <Database className="h-4 w-4 text-slate-400" />
    }
  }

  const SortIcon = ({ field }: { field: keyof Insight }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 opacity-0" />
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-emerald-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-emerald-600" />
    )
  }

  /* ---------------------------------------------------------------------- */
  /*                           Filtering & sorting                          */
  /* ---------------------------------------------------------------------- */
  const filteredInsights = useMemo(() => {
    const filtered = insights.filter(insight => {
      const term = searchTerm.toLowerCase()
      const matchesSearch =
        insight.title.toLowerCase().includes(term) ||
        insight.description?.toLowerCase().includes(term) ||
        insight.sourceDatasets.some(ds => ds.toLowerCase().includes(term))

      const matchesStatus = !statusFilter || insight.status === statusFilter
      const matchesType =
        !computationTypeFilter || insight.computationType === computationTypeFilter

      // quick date-range comparison
      let matchesDate = true
      if (dateRange) {
        const insightDate = new Date(insight.dateGenerated).getTime()
        const now = Date.now()
        const diffDays = (now - insightDate) / (1000 * 60 * 60 * 24)
        if (dateRange === "7d") matchesDate = diffDays <= 7
        if (dateRange === "30d") matchesDate = diffDays <= 30
        if (dateRange === "90d") matchesDate = diffDays <= 90
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate
    })

    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return 0
    })

    return filtered
  }, [
    insights,
    searchTerm,
    statusFilter,
    computationTypeFilter,
    dateRange,
    sortField,
    sortDirection,
  ])

  /* ---------------------------------------------------------------------- */
  /*                               Handlers                                 */
  /* ---------------------------------------------------------------------- */
  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight)
    setShowDetailModal(true)
  }

  const handleFlag = (id: string, reason: string) =>
    setInsights(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: "flagged", metadata: { ...i.metadata, flagReason: reason } } : i,
      ),
    )

  const handleRerun = (id: string) =>
    setInsights(prev =>
      prev.map(i =>
        i.id === id ? { ...i, status: "success", dateGenerated: new Date().toISOString() } : i,
      ),
    )

  const handleComparisonToggle = (id: string) =>
    setSelectedForComparison(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    )

  const uniqueTypes = [...new Set(insights.map(i => i.computationType))]

  /* ---------------------------------------------------------------------- */
  /*                                 UI                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Insights Dashboard
          </h1>
          <p className="text-slate-600">
            Privacy-preserving analytics and computational insights
          </p>
        </div>

        {selectedForComparison.length > 1 && (
          <Button
            onClick={() => setShowComparisonModal(true)}
            className="bg-gradient-to-r from-[#3A6EFF] to-emerald-500 hover:from-[#3A6EFF]/90 hover:to-emerald-500/90"
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Selected ({selectedForComparison.length})
          </Button>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Insights",
            value: insights.length.toString(),
            change: "+5 this week",
            icon: Eye,
            color: "text-[#3A6EFF]",
            bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
          },
          {
            title: "Successful Computations",
            value: insights.filter(i => i.status === "success").length.toString(),
            change: "94% success rate",
            icon: CheckCircle,
            color: "text-emerald-600",
            bgGradient: "from-emerald-500/10 to-emerald-500/5",
          },
          {
            title: "Flagged for Review",
            value: insights.filter(i => i.status === "flagged").length.toString(),
            change: "2 need attention",
            icon: Flag,
            color: "text-red-600",
            bgGradient: "from-red-500/10 to-red-500/5",
          },
          {
            title: "Active Datasets",
            value: "12",
            change: "SMPC-enabled",
            icon: Database,
            color: "text-[#3A6EFF]",
            bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card
              key={idx}
              className="group bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardContent className="p-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search insights, datasets, or descriptions…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border border-slate-200 focus:border-[#3A6EFF]"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-md px-4 py-2 pr-8 text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="flagged">Flagged</option>
                <option value="needs review">Needs Review</option>
              </select>
              <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Type filter */}
            <div className="relative">
              <select
                value={computationTypeFilter}
                onChange={e => setComputationTypeFilter(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-md px-4 py-2 pr-8 text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <BarChart3 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Date filter */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-md px-4 py-2 pr-8 text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">All Time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm || statusFilter || computationTypeFilter || dateRange) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
                >
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter && (
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-600 border-emerald-200"
                >
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {computationTypeFilter && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-50 text-yellow-600 border-yellow-200"
                >
                  Type: {computationTypeFilter}
                  <button
                    onClick={() => setComputationTypeFilter("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {dateRange && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 border-slate-200"
                >
                  Date: {dateRange}
                  <button
                    onClick={() => setDateRange("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInsights.map((insight, idx) => (
          <Card
            key={insight.id}
            onClick={() => handleInsightClick(insight)}
            className={cn(
              "group bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer animate-in fade-in-0 slide-in-from-bottom-4",
              selectedForComparison.includes(insight.id) &&
                "ring-2 ring-emerald-500/50 border-emerald-300",
            )}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getComputationIcon(insight.computationType)}
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-600 text-xs"
                    >
                      {insight.computationType}
                    </Badge>
                  </div>
                  <CardTitle className="text-base text-slate-900 group-hover:text-[#3A6EFF] transition-colors">
                    {insight.title}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedForComparison.includes(insight.id)}
                    onCheckedChange={() => handleComparisonToggle(insight.id)}
                    onClick={e => e.stopPropagation()}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <Badge
                    variant="secondary"
                    className={cn(
                      "transition-all",
                      getStatusColor(insight.status),
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(insight.status)}
                      <span className="text-xs">{insight.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {insight.description}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Generated</span>
                    <span className="text-slate-700">
                      {formatDate(insight.dateGenerated)}
                    </span>
                  </div>
                  {insight.analyst && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Analyst</span>
                      <span className="text-slate-700">{insight.analyst}</span>
                    </div>
                  )}
                </div>

                {/* datasets */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">Source Datasets</p>
                  <div className="flex flex-wrap gap-1">
                    {insight.sourceDatasets.slice(0, 2).map(ds => (
                      <Badge
                        key={ds}
                        variant="secondary"
                        className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 text-xs"
                      >
                        {ds}
                      </Badge>
                    ))}
                    {insight.sourceDatasets.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 border-slate-200 text-xs"
                      >
                        +{insight.sourceDatasets.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredInsights.length === 0 && (
        <Card className="bg-white border border-slate-200">
          <CardContent className="py-12 text-center">
            <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              No insights found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail modal */}
      <InsightDetailModal
        insight={selectedInsight}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onFlag={handleFlag}
        onRerun={handleRerun}
      />

      {/* Comparison modal */}
      <InsightComparisonModal
        insights={insights.filter(i => selectedForComparison.includes(i.id))}
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
      />
    </div>
  )
}
