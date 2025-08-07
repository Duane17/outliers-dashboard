"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Lock,
  FileCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SMPCJob {
  id: string
  initiatedBy: string
  datasets: string[]
  computationMethod: string
  status: "success" | "failed" | "flagged" | "running"
  timestamp: string
  privacyRegion: string
  resultMetadata: {
    accuracy: number
    dataPoints: number
    processingTime: string
    privacyBudget: number
  }
  complianceStatus: {
    gdprReady: boolean
    auditLogged: boolean
    encryptionVerified: boolean
  }
}

interface SMPCAuditTrailProps {
  className?: string
}

export function SMPCAuditTrail({ className }: SMPCAuditTrailProps) {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())

  const smpcJobs: SMPCJob[] = [
    {
      id: "smpc-001",
      initiatedBy: "Sarah Chen",
      datasets: ["Customer Behavior Analysis", "Transaction History"],
      computationMethod: "correlation analysis",
      status: "success",
      timestamp: "2024-01-15T14:30:00Z",
      privacyRegion: "EU",
      resultMetadata: {
        accuracy: 94.2,
        dataPoints: 15847,
        processingTime: "2.3s",
        privacyBudget: 0.85,
      },
      complianceStatus: {
        gdprReady: true,
        auditLogged: true,
        encryptionVerified: true,
      },
    },
    {
      id: "smpc-002",
      initiatedBy: "Mike Johnson",
      datasets: ["Sales Performance Q4", "Market Research Data"],
      computationMethod: "regression analysis",
      status: "running",
      timestamp: "2024-01-15T16:45:00Z",
      privacyRegion: "US",
      resultMetadata: {
        accuracy: 0,
        dataPoints: 8923,
        processingTime: "ongoing",
        privacyBudget: 0.92,
      },
      complianceStatus: {
        gdprReady: false,
        auditLogged: true,
        encryptionVerified: true,
      },
    },
    {
      id: "smpc-003",
      initiatedBy: "Anna Rodriguez",
      datasets: ["User Engagement Metrics"],
      computationMethod: "trend analysis",
      status: "flagged",
      timestamp: "2024-01-14T11:20:00Z",
      privacyRegion: "EU",
      resultMetadata: {
        accuracy: 67.8,
        dataPoints: 5432,
        processingTime: "1.8s",
        privacyBudget: 0.45,
      },
      complianceStatus: {
        gdprReady: true,
        auditLogged: true,
        encryptionVerified: false,
      },
    },
  ]

  const toggleExpanded = (jobId: string) => {
    const newExpanded = new Set(expandedJobs)
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId)
    } else {
      newExpanded.add(jobId)
    }
    setExpandedJobs(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-[#22D3A6]" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "running":
        return <Clock className="h-4 w-4 text-[#3A6EFF] animate-pulse" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      case "failed":
        return "bg-red-400/10 text-red-400 border-red-400/20"
      case "flagged":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      case "running":
        return "bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
      default:
        return "bg-slate-600/10 text-slate-300 border-slate-600/20"
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

  return (
    <Card className={cn("bg-slate-900/50 backdrop-blur-sm border-slate-800/50", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Shield className="h-5 w-5 text-[#3A6EFF]" />
          SMPC Job Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {smpcJobs.map((job, index) => {
            const isExpanded = expandedJobs.has(job.id)
            return (
              <div
                key={job.id}
                className={cn(
                  "border rounded-lg transition-all duration-300 animate-in fade-in-0 slide-in-from-left-4",
                  job.status === "success"
                    ? "border-[#22D3A6]/20 bg-[#22D3A6]/5 hover:border-[#22D3A6]/30"
                    : job.status === "flagged"
                      ? "border-yellow-400/20 bg-yellow-400/5 hover:border-yellow-400/30"
                      : job.status === "running"
                        ? "border-[#3A6EFF]/20 bg-[#3A6EFF]/5 hover:border-[#3A6EFF]/30"
                        : "border-slate-700/30 bg-slate-800/30 hover:border-slate-600/50",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpanded(job.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleExpanded(job.id)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium text-slate-100 text-sm">Job {job.id}</p>
                        <p className="text-xs text-slate-400">{job.computationMethod}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Initiated by</p>
                        <p className="text-sm text-slate-300">{job.initiatedBy}</p>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <span className="text-xs text-slate-400">{formatDate(job.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {job.datasets.slice(0, 2).map((dataset, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 text-xs"
                      >
                        {dataset}
                      </Badge>
                    ))}
                    {job.datasets.length > 2 && (
                      <Badge variant="secondary" className="bg-slate-600/10 text-slate-400 border-slate-600/20 text-xs">
                        +{job.datasets.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-700/30 p-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Privacy Region & Metadata */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-200 mb-2">Privacy Region</h4>
                          <Badge variant="secondary" className="bg-slate-700/30 text-slate-300 border-slate-600/30">
                            {job.privacyRegion}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-slate-200 mb-3">Result Metadata</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Accuracy</span>
                              <span className="text-slate-300 font-mono">
                                {job.status === "running" ? "—" : `${job.resultMetadata.accuracy}%`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Data Points</span>
                              <span className="text-slate-300 font-mono">
                                {job.resultMetadata.dataPoints.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Processing Time</span>
                              <span className="text-slate-300 font-mono">{job.resultMetadata.processingTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Privacy Budget</span>
                              <span className="text-slate-300 font-mono">{job.resultMetadata.privacyBudget}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-200 mb-3">Compliance Verification</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-300">GDPR Ready</span>
                            </div>
                            {job.complianceStatus.gdprReady ? (
                              <CheckCircle className="h-4 w-4 text-[#22D3A6]" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-300">Audit Logged</span>
                            </div>
                            {job.complianceStatus.auditLogged ? (
                              <CheckCircle className="h-4 w-4 text-[#22D3A6]" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-300">Encryption Verified</span>
                            </div>
                            {job.complianceStatus.encryptionVerified ? (
                              <CheckCircle className="h-4 w-4 text-[#22D3A6]" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
