"use client"

import { useState } from "react"
import {
  Download,
  FileText,
  Shield,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Globe,
  Eye,
  AlertTriangle,
  Hash,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PrivacyAcceptance {
  id: string
  user: string
  version: string
  acceptedAt: string
  documentHash: string
  ipAddress: string
}

interface ComplianceReportsProps {
  className?: string
  selectedRegion: string
}

export function ComplianceReports({ className, selectedRegion }: ComplianceReportsProps) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const privacyAcceptances: PrivacyAcceptance[] = [
    {
      id: "1",
      user: "Sarah Chen",
      version: "v2.1",
      acceptedAt: "2024-01-15T10:30:00Z",
      documentHash: "sha256:a1b2c3d4e5f6...",
      ipAddress: "192.168.1.45",
    },
    {
      id: "2",
      user: "Mike Johnson",
      version: "v2.1",
      acceptedAt: "2024-01-14T15:45:00Z",
      documentHash: "sha256:a1b2c3d4e5f6...",
      ipAddress: "10.0.0.23",
    },
    {
      id: "3",
      user: "Anna Rodriguez",
      version: "v2.0",
      acceptedAt: "2024-01-10T09:15:00Z",
      documentHash: "sha256:f6e5d4c3b2a1...",
      ipAddress: "172.16.0.8",
    },
    {
      id: "4",
      user: "David Kim",
      version: "v2.1",
      acceptedAt: "2024-01-12T14:20:00Z",
      documentHash: "sha256:a1b2c3d4e5f6...",
      ipAddress: "192.168.1.67",
    },
  ]

  const getComplianceStatus = (region: string) => {
    const statuses = {
      EU: {
        gdpr: true,
        ccpa: false,
        hipaa: false,
        localLaws: true,
      },
      US: {
        gdpr: false,
        ccpa: true,
        hipaa: true,
        localLaws: true,
      },
      Kenya: {
        gdpr: false,
        ccpa: false,
        hipaa: false,
        localLaws: true,
      },
      Malawi: {
        gdpr: false,
        ccpa: false,
        hipaa: false,
        localLaws: true,
      },
    }
    return statuses[region as keyof typeof statuses] || statuses.US
  }

  const complianceStatus = getComplianceStatus(selectedRegion)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGeneratingReport(false)
    // In a real app, this would trigger a download
    console.log(`Generating ${reportType} report for ${selectedRegion}`)
  }

  const getVersionBadgeColor = (version: string) => {
    return version === "v2.1"
      ? "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Compliance Status */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Shield className="h-5 w-5 text-[#3A6EFF]" />
            Compliance Status - {selectedRegion}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">GDPR</span>
              </div>
              {complianceStatus.gdpr ? (
                <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-600/10 text-slate-400 border-slate-600/20">
                  N/A
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">CCPA</span>
              </div>
              {complianceStatus.ccpa ? (
                <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-600/10 text-slate-400 border-slate-600/20">
                  N/A
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">HIPAA</span>
              </div>
              {complianceStatus.hipaa ? (
                <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-600/10 text-slate-400 border-slate-600/20">
                  N/A
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-300">Local Laws</span>
              </div>
              {complianceStatus.localLaws ? (
                <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge className="bg-red-400/10 text-red-400 border-red-400/20">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Review
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice Acceptance Logs */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Eye className="h-5 w-5 text-[#22D3A6]" />
            Privacy Notice Acceptance Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {privacyAcceptances.map((acceptance, index) => (
              <div
                key={acceptance.id}
                className={cn(
                  "flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-100">{acceptance.user}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getVersionBadgeColor(acceptance.version)}>
                        {acceptance.version}
                      </Badge>
                      <span className="text-xs text-slate-400">{formatDate(acceptance.acceptedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-3 w-3 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400">{acceptance.documentHash.slice(0, 16)}...</span>
                  </div>
                  <span className="text-xs text-slate-500">{acceptance.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Version History */}
          <div className="mt-6 p-4 bg-[#3A6EFF]/10 border border-[#3A6EFF]/20 rounded-lg">
            <h4 className="font-medium text-[#3A6EFF] mb-2">Document Version History</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">v2.1 (Current)</span>
                <span className="text-slate-400">Updated SMPC privacy guarantees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">v2.0</span>
                <span className="text-slate-400">Added regional compliance sections</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">v1.9</span>
                <span className="text-slate-400">Initial GDPR compliance framework</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloadable Reports */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Download className="h-5 w-5 text-[#3A6EFF]" />
            Compliance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleGenerateReport("GDPR")}
              disabled={isGeneratingReport || !complianceStatus.gdpr}
              className="flex items-center justify-center gap-2 h-16 bg-gradient-to-r from-[#3A6EFF]/20 to-[#3A6EFF]/10 border border-[#3A6EFF]/30 text-slate-100 hover:from-[#3A6EFF]/30 hover:to-[#3A6EFF]/20 hover:border-[#3A6EFF]/50 transition-all duration-300 disabled:opacity-50"
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Download GDPR Report</p>
                <p className="text-xs text-slate-400">Complete compliance audit</p>
              </div>
              {isGeneratingReport && <Clock className="h-4 w-4 animate-spin" />}
            </Button>

            <Button
              onClick={() => handleGenerateReport("Access Logs")}
              disabled={isGeneratingReport}
              className="flex items-center justify-center gap-2 h-16 bg-gradient-to-r from-[#22D3A6]/20 to-[#22D3A6]/10 border border-[#22D3A6]/30 text-slate-100 hover:from-[#22D3A6]/30 hover:to-[#22D3A6]/20 hover:border-[#22D3A6]/50 transition-all duration-300"
            >
              <Eye className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Export Access Logs</p>
                <p className="text-xs text-slate-400">30-day activity report</p>
              </div>
              {isGeneratingReport && <Clock className="h-4 w-4 animate-spin" />}
            </Button>

            <Button
              onClick={() => handleGenerateReport("SMPC Audit")}
              disabled={isGeneratingReport}
              className="flex items-center justify-center gap-2 h-16 bg-gradient-to-r from-slate-700/20 to-slate-600/10 border border-slate-600/30 text-slate-100 hover:from-slate-700/30 hover:to-slate-600/20 hover:border-slate-600/50 transition-all duration-300"
            >
              <Shield className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">SMPC Audit Trail</p>
                <p className="text-xs text-slate-400">Computation history</p>
              </div>
              {isGeneratingReport && <Clock className="h-4 w-4 animate-spin" />}
            </Button>

            <Button
              onClick={() => handleGenerateReport("Privacy Summary")}
              disabled={isGeneratingReport}
              className="flex items-center justify-center gap-2 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-400/10 border border-yellow-400/30 text-slate-100 hover:from-yellow-400/30 hover:to-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300"
            >
              <Calendar className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Privacy Summary</p>
                <p className="text-xs text-slate-400">Monthly overview</p>
              </div>
              {isGeneratingReport && <Clock className="h-4 w-4 animate-spin" />}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <h4 className="font-medium text-slate-200 mb-2">Report Information</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Reports are generated in real-time with current data</li>
              <li>• All exports include digital signatures for authenticity</li>
              <li>• Reports are automatically encrypted and password-protected</li>
              <li>• Generation typically takes 30-60 seconds for large datasets</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
