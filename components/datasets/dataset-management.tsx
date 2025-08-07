"use client"

import { useState, useMemo } from "react"
import { Search, Filter, ChevronUp, ChevronDown, Plus, Database, Shield, Lock, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DatasetUploadModal } from "./dataset-upload-modal"
import { DatasetDetailPanel } from "./dataset-detail-panel"
import { cn } from "@/lib/utils"

interface Dataset {
  id: string
  name: string
  type: string
  size: number
  lastUpdated: string
  privacyStatus: string
  tags: string[]
  metadata: any
  smpcReady: boolean
  encrypted: boolean
}

export function DatasetManagement() {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "1",
      name: "Customer Behavior Analysis",
      type: "CSV",
      size: 15728640, // 15MB
      lastUpdated: "2024-01-15T10:30:00Z",
      privacyStatus: "private",
      tags: ["customer", "behavior", "analytics"],
      metadata: { rows: 50000, columns: 12 },
      smpcReady: true,
      encrypted: true,
    },
    {
      id: "2",
      name: "Sales Performance Q4",
      type: "JSON",
      size: 8388608, // 8MB
      lastUpdated: "2024-01-14T15:45:00Z",
      privacyStatus: "public",
      tags: ["sales", "quarterly", "performance"],
      metadata: { rows: 25000, columns: 8 },
      smpcReady: false,
      encrypted: true,
    },
    {
      id: "3",
      name: "Market Research Data",
      type: "XLSX",
      size: 31457280, // 30MB
      lastUpdated: "2024-01-13T09:15:00Z",
      privacyStatus: "private",
      tags: ["market", "research", "survey"],
      metadata: { rows: 75000, columns: 15 },
      smpcReady: true,
      encrypted: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [sortField, setSortField] = useState<keyof Dataset>("lastUpdated")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
  const [showDetailPanel, setShowDetailPanel] = useState(false)

  // Get all unique tags for filter
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    datasets.forEach((dataset) => {
      dataset.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [datasets])

  // Filter and sort datasets
  const filteredDatasets = useMemo(() => {
    const filtered = datasets.filter((dataset) => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = !selectedTag || dataset.tags.includes(selectedTag)
      const matchesStatus = !selectedStatus || dataset.privacyStatus === selectedStatus
      return matchesSearch && matchesTag && matchesStatus
    })

    // Sort datasets
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [datasets, searchTerm, selectedTag, selectedStatus, sortField, sortDirection])

  const handleSort = (field: keyof Dataset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDatasetClick = (dataset: Dataset) => {
    setSelectedDataset(dataset)
    setShowDetailPanel(true)
  }

  const handleDatasetUpdate = (updatedDataset: Dataset) => {
    setDatasets(datasets.map((d) => (d.id === updatedDataset.id ? updatedDataset : d)))
    setSelectedDataset(updatedDataset)
  }

  const handleDatasetUpload = (newDataset: Dataset) => {
    setDatasets([newDataset, ...datasets])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const SortIcon = ({ field }: { field: keyof Dataset }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 opacity-0" />
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-[#22D3A6]" />
    ) : (
      <ChevronDown className="h-4 w-4 text-[#22D3A6]" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Dataset Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your secure datasets and collaboration settings
          </p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] hover:from-[#3A6EFF]/90 hover:to-[#22D3A6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Dataset
        </Button>
      </div>


      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-300 text-gray-900 focus:border-[#3A6EFF]"
            />
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-900 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <Tag className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-900 focus:border-[#22D3A6] focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Active Filters */}
        {(selectedTag || selectedStatus || searchTerm) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge
                variant="secondary"
                className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20"
              >
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge
                variant="secondary"
                className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
              >
                Tag: {selectedTag}
                <button onClick={() => setSelectedTag("")} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            )}
            {selectedStatus && (
              <Badge
                variant="secondary"
                className="bg-gray-200 text-gray-700 border-gray-300"
              >
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("")} className="ml-1 hover:text-red-500">
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Dataset Table */}
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Dataset Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Type
                    <SortIcon field="type" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("size")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Size
                    <SortIcon field="size" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort("lastUpdated")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#22D3A6] transition-colors font-medium"
                  >
                    Last Updated
                    <SortIcon field="lastUpdated" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Privacy Status</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-gray-700 font-medium">Tags</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map((dataset, index) => (
                <tr
                  key={dataset.id}
                  onClick={() => handleDatasetClick(dataset)}
                  className={cn(
                    "border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                    index % 2 === 0 ? "bg-gray-50" : "bg-transparent"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Database className="h-4 w-4 text-[#3A6EFF]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dataset.name}</p>
                        <p className="text-xs text-gray-500">ID: {dataset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      {dataset.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-700">
                    {formatFileSize(dataset.size)}
                  </td>
                  <td className="p-4 text-gray-700">
                    {formatDate(dataset.lastUpdated)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          dataset.privacyStatus === "private"
                            ? "bg-gray-200 text-gray-700 border-gray-300"
                            : "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
                        }
                      >
                        {dataset.privacyStatus}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {dataset.smpcReady && (
                          <Shield
                            className="h-3 w-3 text-[#22D3A6]"
                            title="SMPC Ready"
                          />
                        )}
                        {dataset.encrypted && (
                          <Lock
                            className="h-3 w-3 text-[#3A6EFF]"
                            title="Encrypted"
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {dataset.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {dataset.tags.length > 2 && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-200 text-gray-500 border-gray-300 text-xs"
                        >
                          +{dataset.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No datasets found matching your criteria
            </p>
          </div>
        )}
      </div>


      {/* Upload Modal */}
      <DatasetUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleDatasetUpload}
      />

      {/* Detail Panel */}
      <DatasetDetailPanel
        dataset={selectedDataset}
        isOpen={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        onUpdate={handleDatasetUpdate}
      />
    </div>
  )
}
