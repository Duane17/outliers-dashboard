"use client"

import { useState } from "react"
import {
  X,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/lib/utils"

interface Insight {
  id: string
  title: string
  dateGenerated: string
  sourceDatasets: string[]
  computationType: string
  status: string
  data: any[]
  metadata: any
}

interface InsightComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  insights: Insight[]
}

export function InsightComparisonModal({
  isOpen,
  onClose,
  insights,
}: InsightComparisonModalProps) {
  const [activeInsights, setActiveInsights] = useState<Record<string, boolean>>(
    insights.reduce((acc, i) => ({ ...acc, [i.id]: true }), {}),
  )

  if (!isOpen || insights.length === 0) return null

  const toggleInsight = (id: string) =>
    setActiveInsights(prev => ({ ...prev, [id]: !prev[id] }))

  const activeInsightsList = insights.filter(i => activeInsights[i.id])

  /* ---- mock comparison data ---- */
  const comparisonData = [
    { month: "Jan", insight1: 65, insight2: 78, insight3: 45 },
    { month: "Feb", insight1: 72, insight2: 85, insight3: 52 },
    { month: "Mar", insight1: 68, insight2: 82, insight3: 48 },
    { month: "Apr", insight1: 75, insight2: 88, insight3: 55 },
    { month: "May", insight1: 82, insight2: 92, insight3: 62 },
    { month: "Jun", insight1: 79, insight2: 89, insight3: 58 },
  ]

  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
  ]

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-6xl mx-4 bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Compare Insights
            </h2>
            <p className="text-sm text-slate-600">
              Analyze multiple insights side by side
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* insight toggles */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              Select Insights to Compare
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, idx) => (
                <div
                  key={insight.id}
                  onClick={() => toggleInsight(insight.id)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition",
                    activeInsights[insight.id]
                      ? "border-[#3A6EFF]/50 bg-[#3A6EFF]/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-900">
                      {insight.title}
                    </h4>
                    {activeInsights[insight.id] ? (
                      <ToggleRight className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: chartColors[idx % chartColors.length],
                      }}
                    />
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 text-xs"
                    >
                      {insight.computationType}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* comparison chart */}
          {activeInsightsList.length > 0 && (
            <Card className="bg-white border border-slate-200 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="h-5 w-5 text-[#3A6EFF]" />
                  Comparative Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    insight1: {
                      label: activeInsightsList[0]?.title || "Insight 1",
                      color: "hsl(var(--chart-1))",
                    },
                    insight2: {
                      label: activeInsightsList[1]?.title || "Insight 2",
                      color: "hsl(var(--chart-2))",
                    },
                    insight3: {
                      label: activeInsightsList[2]?.title || "Insight 3",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      {activeInsightsList.map((insight, idx) => (
                        <Line
                          key={insight.id}
                          type="monotone"
                          dataKey={`insight${idx + 1}`}
                          stroke={chartColors[idx]}
                          strokeWidth={3}
                          dot={{
                            fill: chartColors[idx],
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                            stroke: chartColors[idx],
                            strokeWidth: 2,
                          }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* metrics cards */}
          {activeInsightsList.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeInsightsList.map((insight, idx) => (
                <Card
                  key={insight.id}
                  className="bg-white border border-slate-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColors[idx] }}
                      />
                      <CardTitle className="text-base text-slate-900">
                        {insight.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">
                          Computation Type
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 text-xs"
                        >
                          {insight.computationType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Datasets</span>
                        <span className="text-sm text-slate-700">
                          {insight.sourceDatasets.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">
                          Generated
                        </span>
                        <span className="text-sm text-slate-700">
                          {new Date(
                            insight.dateGenerated,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {/* mock metrics */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-500">
                            Accuracy
                          </span>
                          <span className="text-sm font-medium text-emerald-600">
                            {Math.floor(Math.random() * 20) + 80}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">
                            Confidence
                          </span>
                          <span className="text-sm font-medium text-[#3A6EFF]">
                            {Math.floor(Math.random() * 15) + 85}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* key differences */}
          {activeInsightsList.length > 1 && (
            <Card className="bg-white border border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-900">
                  Key Differences &amp; Overlaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="font-medium text-emerald-600 mb-2">
                      Convergent Patterns
                    </h4>
                    <p className="text-sm text-slate-700">
                      All selected insights show similar upward trends in Q2,
                      suggesting consistent market behavior across datasets.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-600 mb-2">
                      Notable Divergence
                    </h4>
                    <p className="text-sm text-slate-700">
                      Insight 3 shows significantly lower values, potentially
                      indicating different data sources or computation
                      parameters.
                    </p>
                  </div>
                  <div className="p-4 bg-[#3A6EFF]/10 border border-[#3A6EFF]/20 rounded-lg">
                    <h4 className="font-medium text-[#3A6EFF] mb-2">
                      Statistical Significance
                    </h4>
                    <p className="text-sm text-slate-700">
                      Correlation coefficient between Insight 1 and 2: 0.87
                      (strong positive correlation)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
