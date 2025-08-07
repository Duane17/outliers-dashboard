"use client"

import { useState } from "react"
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Dataset {
  id: string
  name: string
  encryptionDate: string
  algorithm: string
  status: "encrypted" | "pending" | "not encrypted"
  smpcFragmented: boolean
}

interface EncryptionPrivacyIndicatorsProps {
  className?: string
}

export function EncryptionPrivacyIndicators({ className }: EncryptionPrivacyIndicatorsProps) {
  const [zeroTrustEnforced, setZeroTrustEnforced] = useState(true)
  const [encryptionEnforced, setEncryptionEnforced] = useState(true)

  const datasets: Dataset[] = [
    {
      id: "1",
      name: "Customer Behavior Analysis",
      encryptionDate: "2024-01-15T10:30:00Z",
      algorithm: "AES-256 + SMPC",
      status: "encrypted",
      smpcFragmented: true,
    },
    {
      id: "2",
      name: "Sales Performance Q4",
      encryptionDate: "2024-01-14T15:45:00Z",
      algorithm: "AES-256",
      status: "encrypted",
      smpcFragmented: false,
    },
    {
      id: "3",
      name: "Market Research Data",
      encryptionDate: "",
      algorithm: "",
      status: "pending",
      smpcFragmented: false,
    },
    {
      id: "4",
      name: "User Engagement Metrics",
      encryptionDate: "2024-01-13T09:15:00Z",
      algorithm: "AES-256 + SMPC",
      status: "encrypted",
      smpcFragmented: true,
    },
    {
      id: "5",
      name: "Legacy Customer Data",
      encryptionDate: "",
      algorithm: "",
      status: "not encrypted",
      smpcFragmented: false,
    },
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "encrypted":
        return <Lock className="h-4 w-4 text-[#22D3A6]" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-400 animate-pulse" />
      case "not encrypted":
        return <Unlock className="h-4 w-4 text-red-400" />
      default:
        return <Lock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "encrypted":
        return "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
      case "pending":
        return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
      case "not encrypted":
        return "bg-red-400/10 text-red-400 border-red-400/20"
      default:
        return "bg-slate-600/10 text-slate-300 border-slate-600/20"
    }
  }

  const encryptedCount = datasets.filter((d) => d.status === "encrypted").length
  const pendingCount = datasets.filter((d) => d.status === "pending").length
  const unencryptedCount = datasets.filter((d) => d.status === "not encrypted").length

  return (
    <div className={cn("space-y-6", className)}>
      {/* Zero-Trust Status */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Shield className="h-5 w-5 text-[#3A6EFF]" />
            Zero-Trust Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Global Status */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-3">
                {zeroTrustEnforced ? (
                  <CheckCircle className="h-6 w-6 text-[#22D3A6]" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400" />
                )}
                <div>
                  <p className="font-medium text-slate-100">Zero-Trust Enforced</p>
                  <p className="text-sm text-slate-400">
                    {zeroTrustEnforced
                      ? "All access requires verification and encryption"
                      : "Warning: Zero-trust policies not fully enforced"}
                  </p>
                </div>
              </div>
              <Switch
                checked={zeroTrustEnforced}
                onCheckedChange={setZeroTrustEnforced}
                className="data-[state=checked]:bg-[#22D3A6]"
              />
            </div>

            {/* Weak Password Warning */}
            {!zeroTrustEnforced && (
              <div className="flex items-center gap-3 p-4 bg-red-400/10 border border-red-400/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-red-400">Warning: Weak Dataset Password</p>
                  <p className="text-sm text-slate-300">Some datasets have insufficient password protection</p>
                </div>
              </div>
            )}

            {/* Encryption Enforcement */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-[#3A6EFF]" />
                <div>
                  <p className="font-medium text-slate-100">Encryption Enforced</p>
                  <p className="text-sm text-slate-400">Require encryption for all new datasets</p>
                </div>
              </div>
              <Switch
                checked={encryptionEnforced}
                onCheckedChange={setEncryptionEnforced}
                className="data-[state=checked]:bg-[#22D3A6]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encryption Overview */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Lock className="h-5 w-5 text-[#22D3A6]" />
            Encryption Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-[#22D3A6]/10 border border-[#22D3A6]/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#22D3A6]" />
                <span className="font-medium text-[#22D3A6]">Encrypted</span>
              </div>
              <p className="text-2xl font-bold text-slate-100">{encryptedCount}</p>
              <p className="text-sm text-slate-400">datasets secured</p>
            </div>

            <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium text-yellow-400">Pending</span>
              </div>
              <p className="text-2xl font-bold text-slate-100">{pendingCount}</p>
              <p className="text-sm text-slate-400">awaiting encryption</p>
            </div>

            <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-400">Unencrypted</span>
              </div>
              <p className="text-2xl font-bold text-slate-100">{unencryptedCount}</p>
              <p className="text-sm text-slate-400">require attention</p>
            </div>
          </div>

          {/* Dataset Encryption Status */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-200">Dataset Encryption Status</h4>
            {datasets.map((dataset, index) => (
              <div
                key={dataset.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                  dataset.status === "encrypted"
                    ? "border-[#22D3A6]/20 bg-[#22D3A6]/5"
                    : dataset.status === "pending"
                      ? "border-yellow-400/20 bg-yellow-400/5"
                      : "border-red-400/20 bg-red-400/5",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(dataset.status)}
                  <div>
                    <p className="font-medium text-slate-100">{dataset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getStatusColor(dataset.status)}>
                        {dataset.status}
                      </Badge>
                      {dataset.smpcFragmented && (
                        <Badge className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 text-xs">SMPC Ready</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300 font-mono">{dataset.algorithm || "—"}</p>
                  <p className="text-xs text-slate-400">{formatDate(dataset.encryptionDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
