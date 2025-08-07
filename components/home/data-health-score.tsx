"use client"

import { useState } from "react"
import {
  Shield,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DataHealthScore() {
  const [isExpanded, setIsExpanded] = useState(false)
  const healthScore = 82

  const validationResults = [
    { dataset: "Customer Behavior Analysis", status: "validated", score: 95 },
    { dataset: "Sales Performance Q4", status: "needs-validation", score: 78 },
    { dataset: "Market Research Data", status: "validated", score: 89 },
    { dataset: "User Engagement Metrics", status: "error", score: 45 },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#22D3A6]"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle className="h-4 w-4 text-[#22D3A6]" />
      case "needs-validation":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="bg-white border hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Shield className="h-5 w-5 text-[#3A6EFF]" />
          Data Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score Gauge */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#E5E7EB" // Tailwind gray-200
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 314} 314`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3A6EFF" />
                  <stop offset="100%" stopColor="#22D3A6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={cn("text-2xl font-bold", getScoreColor(healthScore))}>
                  {healthScore}%
                </div>
                <div className="text-xs text-gray-500">Validated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-gray-500 hover:text-[#22D3A6] transition-colors"
        >
          <span className="mr-2">View Details</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </Button>

        {/* Expanded Validation Results */}
        {isExpanded && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            {validationResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="text-sm text-gray-700">{result.dataset}</span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    result.score >= 80
                      ? "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
                      : result.score >= 60
                      ? "bg-yellow-100 text-yellow-600 border-yellow-300"
                      : "bg-red-100 text-red-600 border-red-300"
                  )}
                >
                  {result.score}%
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
