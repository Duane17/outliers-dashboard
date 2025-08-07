"use client"

import type React from "react"
import { useState, useCallback } from "react"
import {
  X,
  Download,
  Shield,
  Lock,
  Unlock,
  Edit2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
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

interface DatasetDetailPanelProps {
  dataset: Dataset | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (dataset: Dataset) => void
}

export function DatasetDetailPanel({
  dataset,
  isOpen,
  onClose,
  onUpdate,
}: DatasetDetailPanelProps) {
  const [editingName, setEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!dataset || !isOpen) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleNameEdit = () => {
    if (editingName) {
      onUpdate({ ...dataset, name: editedName })
      setEditingName(false)
    } else {
      setEditedName(dataset.name)
      setEditingName(true)
    }
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !dataset.tags.includes(tag)) {
      onUpdate({ ...dataset, tags: [...dataset.tags, tag] })
      setNewTag("")
    }
  }
  const removeTag = (tagToRemove: string) => {
    onUpdate({
      ...dataset,
      tags: dataset.tags.filter((t) => t !== tagToRemove),
    })
  }
  const toggleSMPCReady = () =>
    onUpdate({ ...dataset, smpcReady: !dataset.smpcReady })
  const togglePrivacyStatus = () => {
    const newStatus = dataset.privacyStatus === "private" ? "public" : "private"
    onUpdate({ ...dataset, privacyStatus: newStatus })
  }

  const computationHistory = [
    {
      id: "1",
      jobId: "SMPC-2024-001",
      type: "Statistical Analysis",
      timestamp: "2024-01-15T10:30:00Z",
      status: "completed",
    },
    {
      id: "2",
      jobId: "SMPC-2024-002",
      type: "Machine Learning",
      timestamp: "2024-01-14T15:45:00Z",
      status: "completed",
    },
    {
      id: "3",
      jobId: "SMPC-2024-003",
      type: "Data Aggregation",
      timestamp: "2024-01-13T09:15:00Z",
      status: "failed",
    },
  ]

  const columns = [
    { name: "user_id", type: "string", visible: true },
    { name: "email", type: "string", visible: false },
    { name: "age", type: "number", visible: true },
    { name: "purchase_amount", type: "number", visible: true },
    { name: "location", type: "string", visible: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {editingName ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleNameEdit()}
                className="text-xl font-semibold bg-gray-100 border-gray-300 text-gray-900"
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">
                {dataset.name}
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNameEdit}
              className="text-gray-500 hover:text-[#22D3A6]"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Security Status */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#3A6EFF]" />
                Security Status
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {dataset.smpcReady ? (
                    <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
                      SMPC Ready
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300">
                      SMPC Pending
                    </Badge>
                  )}
                  <Switch
                    checked={dataset.smpcReady}
                    onCheckedChange={toggleSMPCReady}
                    className="data-[state=checked]:bg-[#22D3A6]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dataset.encrypted ? (
                  <Lock className="h-4 w-4 text-[#22D3A6]" />
                ) : (
                  <Unlock className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm text-gray-500">
                  {dataset.encrypted
                    ? "Encrypted at rest"
                    : "Not encrypted"}
                </span>
              </div>
            </div>
          </section>

          {/* Dataset Information */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dataset Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Dataset ID</p>
                <p className="text-gray-900 font-mono">{dataset.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Type</p>
                <p className="text-gray-900">{dataset.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Size</p>
                <p className="text-gray-900">
                  {formatFileSize(dataset.size)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {formatDate(dataset.lastUpdated)}
                </p>
              </div>
              {dataset.metadata && (
                <>
                  <div>
                    <p className="text-gray-500">Rows</p>
                    <p className="text-gray-900">
                      {dataset.metadata.rows?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Columns</p>
                    <p className="text-gray-900">
                      {dataset.metadata.columns}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Access Controls */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Access Controls
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Visibility Status</span>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    dataset.privacyStatus === "private"
                      ? "bg-gray-100 text-gray-700 border-gray-300"
                      : "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
                  }
                >
                  {dataset.privacyStatus === "private"
                    ? "Private"
                    : "Public"}
                </Badge>
                <Switch
                  checked={dataset.privacyStatus === "public"}
                  onCheckedChange={togglePrivacyStatus}
                  className="data-[state=checked]:bg-[#22D3A6]"
                />
              </div>
            </div>
          </section>

          {/* Tags */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {dataset.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  className="bg-[#3A6EFF]/10 text-[#3A6EFF] border-[#3A6EFF]/20 hover:bg-[#3A6EFF]/20"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="bg-white border border-gray-300 text-gray-900 focus:border-[#22D3A6]"
                placeholder="Add new tag"
              />
              <Button
                onClick={addTag}
                variant="outline"
                size="icon"
                className="border-gray-300 text-gray-700 hover:border-[#22D3A6] hover:text-[#22D3A6]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* Column Visibility Settings */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="flex items-center justify-between w-full text-lg font-medium text-gray-900 mb-4 hover:text-[#22D3A6] transition-colors"
            >
              <span>Column Visibility Settings</span>
              {showColumnSettings ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            {showColumnSettings && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                {columns.map((col, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {col.visible ? (
                        <Eye className="h-4 w-4 text-[#22D3A6]" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {col.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {col.type}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={col.visible}
                      className="data-[state=checked]:bg-[#22D3A6]"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Computation History */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Computation History
            </h3>
            <div className="space-y-3">
              {computationHistory.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Job ID: {job.jobId}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(job.timestamp)}
                    </p>
                  </div>
                  <Badge
                    className={
                      job.status === "completed"
                        ? "bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20"
                        : job.status === "failed"
                        ? "bg-red-100 text-red-600 border-red-300"
                        : "bg-yellow-100 text-yellow-600 border-yellow-300"
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-[#3A6EFF]/20 to-[#22D3A6]/20 border border-[#3A6EFF]/30 text-white hover:from-[#3A6EFF]/30 hover:to-[#22D3A6]/30">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-400/30 text-red-400 hover:bg-red-50 hover:border-red-400/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
              <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Dataset
                </h3>
                <p className="text-gray-500 mb-4">
                  Are you sure you want to delete "{dataset.name}"? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      onClose()
                    }}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
