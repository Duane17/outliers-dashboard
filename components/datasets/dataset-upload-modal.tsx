"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { X, Upload, CheckCircle, Database, Shield, Lock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DatasetUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (dataset: any) => void
}

export function DatasetUploadModal({
  isOpen,
  onClose,
  onUpload,
}: DatasetUploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [datasetName, setDatasetName] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const allowedTypes = [
    "text/csv",
    "application/json",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  const maxSize = 100 * 1024 * 1024 // 100MB

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) handleFileSelection(files[0])
  }, [])

  const handleFileSelection = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a CSV, JSON, or XLSX file")
      return
    }
    if (file.size > maxSize) {
      alert("File size must be less than 100MB")
      return
    }
    setSelectedFile(file)
    setDatasetName(file.name.split(".")[0])
    const mockMetadata = {
      rows: Math.floor(Math.random() * 10000) + 1000,
      columns: Math.floor(Math.random() * 20) + 5,
      size: file.size,
      type: file.type.includes("csv")
        ? "CSV"
        : file.type.includes("json")
        ? "JSON"
        : "XLSX",
    }
    setMetadata(mockMetadata)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!selectedFile || !datasetName.trim()) return
    setUploading(true)
    await new Promise((r) => setTimeout(r, 2000))
    const newDataset = {
      id: Date.now().toString(),
      name: datasetName,
      type: metadata.type,
      size: selectedFile.size,
      lastUpdated: new Date().toISOString(),
      privacyStatus: "private",
      tags,
      metadata,
      smpcReady: false,
      encrypted: true,
    }
    onUpload(newDataset)
    setUploading(false)
    onClose()
    setSelectedFile(null)
    setMetadata(null)
    setDatasetName("")
    setTags([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl mx-4 bg-white border border-gray-200 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Upload Dataset
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
              dragActive
                ? "border-[#3A6EFF] bg-[#3A6EFF]/5"
                : selectedFile
                ? "border-[#22D3A6] bg-[#22D3A6]/5"
                : "border-gray-300 hover:border-gray-400 bg-gray-50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".csv,.json,.xlsx"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelection(e.target.files[0])
              }
            />

            {selectedFile ? (
              <div className="space-y-3">
                <CheckCircle className="h-12 w-12 text-[#22D3A6] mx-auto" />
                <div>
                  <p className="text-gray-900 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-900 font-medium">
                    Drop your dataset here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports CSV, JSON, XLSX • Max 100MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Preview */}
          {metadata && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-[#3A6EFF]" />
                Dataset Preview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Rows</p>
                  <p className="text-gray-900 font-medium">
                    {metadata.rows.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Columns</p>
                  <p className="text-gray-900 font-medium">
                    {metadata.columns}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="text-gray-900 font-medium">
                    {metadata.type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Size</p>
                  <p className="text-gray-900 font-medium">
                    {(metadata.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dataset Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataset-name" className="text-gray-700">
                Dataset Name
              </Label>
              <Input
                id="dataset-name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="mt-1 bg-white border border-gray-300 text-gray-900 focus:border-[#3A6EFF]"
                placeholder="Enter dataset name"
              />
            </div>

            <div>
              <Label className="text-gray-700">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
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
                  placeholder="Add tag"
                />
                <Button
                  onClick={addTag}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:border-[#22D3A6] hover:text-[#22D3A6]"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !datasetName.trim() || uploading}
            className="bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] hover:from-[#3A6EFF]/90 hover:to-[#22D3A6]/90"
          >
            {uploading ? "Uploading..." : "Upload Dataset"}
          </Button>
        </div>
      </div>
    </div>
  )
}
