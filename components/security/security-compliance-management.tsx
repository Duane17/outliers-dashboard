"use client"

import { useState } from "react"
import { Shield, Lock, Eye, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SMPCAuditTrail } from "./smpc-audit-trail"
import { DataAccessAudit } from "./data-access-audit"
import { EncryptionPrivacyIndicators } from "./encryption-privacy-indicators"
import { ComplianceReports } from "./compliance-reports"
import { RegionalSelector } from "./regional-selector"

export function SecurityComplianceManagement() {
  const [selectedRegion, setSelectedRegion] = useState("EU")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">Security & Compliance</h1>
          <p className="text-slate-400 mt-1">Monitor privacy-preserving operations and regulatory compliance</p>
        </div>
      </div>

      {/* Regional Selector */}
      <div className="max-w-md">
        <RegionalSelector selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>

      {/* Security Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "SMPC Jobs",
            value: "47",
            change: "+12 this week",
            icon: Shield,
            color: "text-[#3A6EFF]",
            bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
          },
          {
            title: "Encrypted Datasets",
            value: "23",
            change: "96% coverage",
            icon: Lock,
            color: "text-[#22D3A6]",
            bgGradient: "from-[#22D3A6]/10 to-[#22D3A6]/5",
          },
          {
            title: "Access Events",
            value: "156",
            change: "Last 24 hours",
            icon: Eye,
            color: "text-[#3A6EFF]",
            bgGradient: "from-[#3A6EFF]/10 to-[#3A6EFF]/5",
          },
          {
            title: "Compliance Score",
            value: "98%",
            change: `${selectedRegion} ready`,
            icon: FileText,
            color: "text-[#22D3A6]",
            bgGradient: "from-[#22D3A6]/10 to-[#22D3A6]/5",
          },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="group bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:bg-slate-900/70 hover:border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 group-hover:border-slate-600/50 transition-colors">
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SMPC Audit Trail */}
        <div className="lg:col-span-2">
          <SMPCAuditTrail />
        </div>

        {/* Data Access Audit */}
        <div className="lg:col-span-2">
          <DataAccessAudit />
        </div>

        {/* Encryption & Privacy Indicators */}
        <div>
          <EncryptionPrivacyIndicators />
        </div>

        {/* Compliance Reports */}
        <div>
          <ComplianceReports selectedRegion={selectedRegion} />
        </div>
      </div>
    </div>
  )
}
