"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Users,
  Clock,
  TrendingUp,
  Upload,
  UserPlus,
  Shield,
  ExternalLink,
  Calendar,
  Zap,
} from "lucide-react"
import { DataHealthScore } from "./data-health-score"
import { ComputationActivityChart } from "./computation-activity-chart"

export function DashboardContent() {
  const summaryStats = [
    {
      title: "Datasets Owned",
      value: "24",
      change: "+3 this week",
      icon: Database,
      color: "text-[#3A6EFF]",
      bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
    },
    {
      title: "Active Collaborations",
      value: "12",
      change: "+2 new",
      icon: Users,
      color: "text-[#22D3A6]",
      bgGradient: "from-[#22D3A6]/10 to-[#22D3A6]/5",
    },
    {
      title: "Pending Requests",
      value: "5",
      change: "2 urgent",
      icon: Clock,
      color: "text-yellow-500",
      bgGradient: "from-yellow-400/10 to-yellow-400/5",
    },
    {
      title: "Insights Generated",
      value: "89",
      change: "+15 today",
      icon: TrendingUp,
      color: "text-[#3A6EFF]",
      bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
    },
  ]

  const recentCollaborations = [
    {
      partner: "DataCorp Analytics",
      title: "Customer Segmentation Study",
      lastActivity: "2 hours ago",
      status: "active",
      participants: 8,
    },
    {
      partner: "Research Institute",
      title: "Market Trend Analysis",
      lastActivity: "5 hours ago",
      status: "pending",
      participants: 12,
    },
    {
      partner: "TechFlow Solutions",
      title: "Performance Optimization",
      lastActivity: "1 day ago",
      status: "completed",
      participants: 6,
    },
  ]

  const recentInsights = [
    {
      title: "Customer Churn Prediction Model",
      summary: "Identified key factors leading to 23% reduction in churn rate",
      dataset: "Customer Behavior Analysis",
      date: "2 hours ago",
      accuracy: "94%",
    },
    {
      title: "Sales Forecast Q1 2024",
      summary: "Projected 18% growth based on historical patterns and market trends",
      dataset: "Sales Performance Data",
      date: "6 hours ago",
      accuracy: "87%",
    },
    {
      title: "User Engagement Optimization",
      summary: "Discovered optimal content timing for 31% engagement boost",
      dataset: "User Interaction Logs",
      date: "1 day ago",
      accuracy: "91%",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      case "pending":
        return "bg-yellow-100 text-yellow-600 border-yellow-300"
      case "completed":
        return "bg-gray-200 text-gray-700 border-gray-300"
      default:
        return "bg-gray-200 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="space-y-8">
      {/* Summary Tiles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="group bg-white border hover:shadow-md transition-shadow duration-300 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />
                <div className="relative flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 group-hover:border-gray-300 transition-colors">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions Bar */}
      <Card className="bg-white border hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" className="flex-1 group border-[#3A6EFF]/30 hover:border-[#3A6EFF]/50">
            <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Upload Dataset
          </Button>
          <Button variant="outline" className="flex-1 group border-[#22D3A6]/30 hover:border-[#22D3A6]/50">
            <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Create Collaboration
          </Button>
          <Button variant="outline" className="flex-1 group border-gray-300 hover:border-gray-400">
            <Shield className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            View Audit Logs
          </Button>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Collaborations */}
        <Card className="lg:col-span-1 bg-white border hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="h-5 w-5 text-[#22D3A6]" />
              Recent Collaborations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCollaborations.map((collab, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#22D3A6] transition-colors">
                      {collab.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{collab.partner}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-[#22D3A6] transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {collab.participants}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {collab.lastActivity}
                    </span>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(collab.status)}>
                    {collab.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Insights */}
        <Card className="lg:col-span-1 bg-white border hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Zap className="h-5 w-5 text-[#3A6EFF]" />
              Recent Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInsights.map((insight, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#3A6EFF] transition-colors flex-1">
                    {insight.title}
                  </h4>
                  <Badge variant="secondary" className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 text-xs">
                    {insight.accuracy}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{insight.summary}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {insight.dataset}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {insight.date}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Data Health Score */}
        <div className="lg:col-span-1">
          <DataHealthScore />
        </div>
      </div>

      {/* Computation Activity Chart */}
      <ComputationActivityChart />
    </div>
  )
}
