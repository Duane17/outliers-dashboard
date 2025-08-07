"use client"

import { useState } from "react"
import {
  X,
  Download,
  RefreshCw,
  Flag,
  Database,
  Calendar,
  User,
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  ImageIcon,
  Copy,
  CheckCircle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

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

interface InsightDetailModalProps {
  insight: Insight | null
  isOpen: boolean
  onClose: () => void
  onFlag: (insightId: string, reason: string) => void
  onRerun: (insightId: string) => void
}

export function InsightDetailModal({
  insight,
  isOpen,
  onClose,
  onFlag,
  onRerun,
}: InsightDetailModalProps) {
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!insight || !isOpen) return null

  /* ---------- helpers ---------- */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-emerald-100 text-emerald-600 border-emerald-200"
      case "flagged":
        return "bg-red-100 text-red-600 border-red-200"
      case "needs review":
        return "bg-yellow-100 text-yellow-600 border-yellow-200"
      default:
        return "bg-slate-100 text-slate-500 border-slate-200"
    }
  }

  const handleFlag = () => {
    if (flagReason.trim()) {
      onFlag(insight.id, flagReason)
      setShowFlagDialog(false)
      setFlagReason("")
    }
  }

  const handleCopyMetadata = () => {
    const metadata = {
      title: insight.title,
      dateGenerated: insight.dateGenerated,
      computationType: insight.computationType,
      sourceDatasets: insight.sourceDatasets,
      status: insight.status,
      analyst: insight.analyst,
    }
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ---------- mock chart data (replace with real data) ---------- */
  const getChartData = () => {
    switch (insight.computationType) {
      case "trend analysis":
        return [
          { month: "Jan", value: 65 },
          { month: "Feb", value: 72 },
          { month: "Mar", value: 68 },
          { month: "Apr", value: 75 },
          { month: "May", value: 82 },
          { month: "Jun", value: 79 },
        ]
      case "correlation":
        return [
          { category: "A", value: 45 },
          { category: "B", value: 78 },
          { category: "C", value: 52 },
          { category: "D", value: 91 },
          { category: "E", value: 67 },
        ]
      case "distribution":
        return [
          { name: "Segment A", value: 35, fill: "hsl(var(--chart-1))" },
          { name: "Segment B", value: 25, fill: "hsl(var(--chart-2))" },
          { name: "Segment C", value: 20, fill: "hsl(var(--chart-3))" },
          { name: "Segment D", value: 20, fill: "hsl(var(--chart-4))" },
        ]
      default:
        return []
    }
  }

  const renderChart = () => {
    const data = getChartData()

    switch (insight.computationType) {
      case "trend analysis":
        return (
          <ChartContainer
            config={{ value: { label: "Value", color: "hsl(var(--chart-1))" } }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )
      case "correlation":
        return (
          <ChartContainer
            config={{ value: { label: "Correlation", color: "hsl(var(--chart-2))" } }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )
      case "distribution":
        return (
          <ChartContainer
            config={{ value: { label: "Distribution", color: "hsl(var(--chart-3))" } }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )
      default:
        return (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            No visualization available
          </div>
        )
    }
  }

  /* ---------- UI ---------- */
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-5xl mx-4 bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">

          {/* Header (sticky) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                {insight.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className={getStatusColor(insight.status)}>
                  {insight.status}
                </Badge>
                <span className="text-sm text-slate-500">
                  Generated {formatDate(insight.dateGenerated)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Export dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                {showExportMenu && (
                  <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Raw Results (JSON)
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Chart as PNG
                      </button>
                      <button
                        onClick={handleCopyMetadata}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded flex items-center gap-2"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        Copy Metadata
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Re-run */}
              <Button
                variant="outline"
                onClick={() => onRerun(insight.id)}
                className="border-[#3A6EFF]/30 text-[#3A6EFF] hover:bg-[#3A6EFF]/10 hover:border-[#3A6EFF]/50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-run
              </Button>

              {/* Flag */}
              <Button
                variant="outline"
                onClick={() => setShowFlagDialog(true)}
                className="border-red-400/30 text-red-500 hover:bg-red-50 hover:border-red-400/50"
              >
                <Flag className="h-4 w-4" />
              </Button>

              {/* Close */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content (scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Visualization + privacy note */}
              <div className="lg:col-span-2">
                <Card className="bg-white border border-slate-200 hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {insight.computationType === "trend analysis" && (
                        <TrendingUp className="h-5 w-5 text-[#3A6EFF]" />
                      )}
                      {insight.computationType === "correlation" && (
                        <BarChart3 className="h-5 w-5 text-[#3A6EFF]" />
                      )}
                      {insight.computationType === "distribution" && (
                        <PieChart className="h-5 w-5 text-[#3A6EFF]" />
                      )}
                      Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{renderChart()}</CardContent>
                </Card>

                <Card className="bg-white border border-slate-200 mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-emerald-600">
                          Privacy-Preserving Computation
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          This insight was generated using Secure Multi-Party Computation
                          (SMPC). Individual data points remain encrypted and private
                          throughout the computation process.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Insight details */}
                <Card className="bg-white border border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-slate-900 text-lg">
                      Insight Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Computation Type</p>
                      <Badge
                        variant="secondary"
                        className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
                      >
                        {insight.computationType}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Generated</p>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate(insight.dateGenerated)}</span>
                      </div>
                    </div>
                    {insight.analyst && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Analyst</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{insight.analyst}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Source datasets */}
                <Card className="bg-white border border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                      <Database className="h-5 w-5 text-emerald-600" />
                      Source Datasets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {insight.sourceDatasets.map((dataset, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <p className="text-sm font-medium text-slate-900">{dataset}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            SMPC-enabled dataset
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Computation metrics */}
                <Card className="bg-white border border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-slate-900">
                      Computation Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Accuracy</span>
                      <span className="text-sm font-medium text-emerald-600">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Confidence</span>
                      <span className="text-sm font-medium text-[#3A6EFF]">87.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Processing Time</span>
                      <span className="text-sm text-slate-700">2.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Data Points</span>
                      <span className="text-sm text-slate-700">15,847</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag dialog */}
      {showFlagDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFlagDialog(false)}
          />
          <div className="relative bg-white border border-slate-200 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Flag Insight</h3>
            <p className="text-sm text-slate-600 mb-4">
              Why are you flagging this insight? This will help improve our analysis quality.
            </p>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="bg-slate-50 border-slate-300 text-slate-900 focus:border-red-400 mb-4"
              placeholder="Describe the issue with this insight..."
              rows={3}
            />
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowFlagDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleFlag}
                disabled={!flagReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Flag Insight
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
