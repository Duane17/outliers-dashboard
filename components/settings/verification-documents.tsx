"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Upload,
  Check,
  Clock,
  X,
  Eye,
  Trash2,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
}

export function VerificationDocuments() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "MIT_Research_Authorization.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "approved",
    },
    {
      id: "2",
      name: "Identity_Verification.png",
      type: "PNG",
      size: "1.8 MB",
      uploadDate: "2024-01-14",
      status: "pending",
    },
  ])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.includes("pdf") ? "PDF" : file.type.split("/")[1].toUpperCase(),
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "pending",
        }
        setDocuments((prev) => [...prev, newDoc])
      }
    })
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const getStatusBadge = (status: Document["status"]) => {
    const base = "border px-2 py-0.5 text-sm flex items-center"
    switch (status) {
      case "approved":
        return (
          <Badge className={`${base} bg-emerald-100 text-emerald-600 border-emerald-200`}>
            <Check className="w-3 h-3 mr-1" /> Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className={`${base} bg-amber-100 text-amber-600 border-amber-200`}>
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className={`${base} bg-rose-100 text-rose-600 border-rose-200`}>
            <X className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-white border">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3A6EFF]" /> Verification Documents
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#3A6EFF] hover:bg-[#3A6EFF]/90 text-white">
                <Upload className="w-4 h-4 mr-2" /> Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border text-slate-900">
              <DialogHeader>
                <DialogTitle>Upload Verification Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Alert className="border-[#3A6EFF]/30 bg-[#3A6EFF]/10">
                  <FileText className="w-4 h-4 text-[#3A6EFF]" />
                  <AlertDescription className="text-slate-700">
                    Upload documents to verify your organization or identity for enhanced security access. Accepted formats: PDF, PNG, JPG (max 10MB)
                  </AlertDescription>
                </Alert>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-[#3A6EFF] bg-[#3A6EFF]/10" : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-700 mb-2">Drag and drop your files here</p>
                  <p className="text-slate-500 text-sm mb-4">or</p>
                  <Button
                    variant="outline"
                    className="border-slate-300 text-slate-700 bg-white"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No verification documents uploaded</p>
            <p className="text-sm">Upload documents to verify your organization or identity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#3A6EFF]" />
                    <div>
                      <h3 className="text-slate-900 font-medium">{doc.name}</h3>
                      <p className="text-muted-foreground text-sm">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(doc.status)}
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#3A6EFF]">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-muted-foreground hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">Uploaded: {doc.uploadDate}</p>
              </div>
            ))}
          </div>
        )}
        <div className="pt-4 border-t">
          <p className="text-muted-foreground text-sm">
            Verification documents help us ensure secure access to sensitive data collaboration features. All documents
            are encrypted and stored securely.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}