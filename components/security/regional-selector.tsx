"use client"

import { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Region {
  code: string
  name: string
  flag: string
  laws: string[]
  complianceLevel: "full" | "partial" | "review"
}

interface RegionalSelectorProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
  className?: string
}

export function RegionalSelector({ selectedRegion, onRegionChange, className }: RegionalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const regions: Region[] = [
    {
      code: "EU",
      name: "European Union",
      flag: "🇪🇺",
      laws: ["GDPR", "ePrivacy Directive"],
      complianceLevel: "full",
    },
    {
      code: "US",
      name: "United States",
      flag: "🇺🇸",
      laws: ["CCPA", "HIPAA", "SOX"],
      complianceLevel: "full",
    },
    {
      code: "Kenya",
      name: "Kenya",
      flag: "🇰🇪",
      laws: ["Data Protection Act 2019"],
      complianceLevel: "partial",
    },
    {
      code: "Malawi",
      name: "Malawi",
      flag: "🇲🇼",
      laws: ["Data Protection Act 2021"],
      complianceLevel: "review",
    },
  ]

  const selectedRegionData = regions.find((r) => r.code === selectedRegion) || regions[0]

  const getComplianceBadge = (level: string) => {
    switch (level) {
      case "full":
        return <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20 text-xs">Full Compliance</Badge>
      case "partial":
        return (
          <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 text-xs">Partial Compliance</Badge>
        )
      case "review":
        return <Badge className="bg-red-400/10 text-red-400 border-red-400/20 text-xs">Needs Review</Badge>
      default:
        return (
          <Badge variant="secondary" className="bg-slate-600/10 text-slate-300 border-slate-600/20 text-xs">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-slate-800/50 border-slate-600 text-slate-100 hover:bg-slate-800/70 hover:border-slate-500"
      >
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-[#3A6EFF]" />
          <span className="text-lg">{selectedRegionData.flag}</span>
          <div className="text-left">
            <p className="font-medium">{selectedRegionData.name}</p>
            <p className="text-xs text-slate-400">{selectedRegionData.laws.join(", ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getComplianceBadge(selectedRegionData.complianceLevel)}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </div>
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-2 bg-slate-900/95 backdrop-blur-md border-slate-700/50 shadow-xl">
          <CardContent className="p-2">
            {regions.map((region) => (
              <button
                key={region.code}
                onClick={() => {
                  onRegionChange(region.code)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-slate-800/50",
                  selectedRegion === region.code && "bg-[#3A6EFF]/10 border border-[#3A6EFF]/20",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{region.flag}</span>
                  <div className="text-left">
                    <p className="font-medium text-slate-100">{region.name}</p>
                    <p className="text-xs text-slate-400">{region.laws.join(", ")}</p>
                  </div>
                </div>
                {getComplianceBadge(region.complianceLevel)}
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
