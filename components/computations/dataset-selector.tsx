"use client"

import { useState } from "react"
import { Check, Database, Users, Shield, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Dataset } from "@/types/computation"

interface DatasetSelectorProps {
  datasets: Dataset[]
  selectedDatasets: string[]
  onSelectionChange: (selectedIds: string[]) => void
}

export function DatasetSelector({ datasets, selectedDatasets, onSelectionChange }: DatasetSelectorProps) {
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const handleDatasetToggle = (datasetId: string) => {
    const isSelected = selectedDatasets.includes(datasetId)
    if (isSelected) {
      onSelectionChange(selectedDatasets.filter((id) => id !== datasetId))
    } else {
      onSelectionChange([...selectedDatasets, datasetId])
    }
  }

  const handlePreviewToggle = (datasetId: string) => {
    setExpandedDataset(expandedDataset === datasetId ? null : datasetId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Select one or more datasets for computation</p>
        <Badge variant="secondary" className="bg-slate-100 text-slate-800">
          {selectedDatasets.length} selected
        </Badge>
      </div>

      <div className="space-y-3">
        {datasets.map((dataset) => {
          const isSelected = selectedDatasets.includes(dataset.id)
          const isExpanded = expandedDataset === dataset.id

          return (
            <Card
              key={dataset.id}
              className={cn(
                "transition-all duration-200 cursor-pointer",
                isSelected
                  ? "border-[#3A6EFF]/50 bg-[#3A6EFF]/10"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <CardContent className="p-4">
                <div onClick={() => handleDatasetToggle(dataset.id)} className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors",
                        isSelected ? "border-[#3A6EFF] bg-[#3A6EFF]" : "border-slate-300"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 truncate">{dataset.name}</h3>
                        {dataset.shared && (
                          <Badge variant="secondary" className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                            <Users className="h-3 w-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                        {dataset.smpcReady ? (
                          <Badge variant="secondary" className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                            <Shield className="h-3 w-3 mr-1" />
                            SMPC Ready
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-400 border-red-200/50">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not Ready
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Owner: {dataset.owner}</span>
                        <span>{formatFileSize(dataset.size)}</span>
                        <span>{dataset.columns.length} columns</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {dataset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {dataset.tags.length > 3 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                            +{dataset.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviewToggle(dataset.id)
                    }}
                    className="text-[#3A6EFF] hover:text-[#22D3A6] text-sm font-medium transition-colors ml-4"
                  >
                    {isExpanded ? "Hide" : "Preview"}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-800">Column Schema</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dataset.columns.map((column) => (
                        <div
                          key={column.name}
                          className="flex items-center justify-between p-2 bg-white rounded border border-slate-200"
                        >
                          <span className="text-sm text-slate-900 font-mono">{column.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                              {column.type}
                            </Badge>
                            {column.nullable && (
                              <Badge variant="secondary" className="bg-slate-50 text-slate-500 text-xs">
                                nullable
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
