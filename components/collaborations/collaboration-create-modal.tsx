"use client"

import { useState } from "react"
import {
  X,
  ChevronRight,
  ChevronLeft,
  Users,
  Database,
  Mail,
  Shield,
  Search,
  Plus,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface CollaborationCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (collaboration: any) => void
}

interface Partner {
  id: string
  name: string
  organization: string
  avatar: string
  email: string
}

interface Dataset {
  id: string
  name: string
  type: string
  smpcReady: boolean
}

interface Participant {
  email: string
  status: "pending" | "invited" | "accepted"
  accessLevel: "read" | "compute" | "manage"
}

export function CollaborationCreateModal({
  isOpen,
  onClose,
  onCreate,
}: CollaborationCreateModalProps) {
  // Track which step of the wizard the user is on (1–5)
  const [currentStep, setCurrentStep] = useState(1)

  // All the fields we collect across steps
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purpose: "",
    selectedPartners: [] as Partner[],
    selectedDatasets: [] as Dataset[],
    participants: [] as Participant[],
  })

  // Static lists of partners & datasets
  const availablePartners: Partner[] = [
    {
      id: "1",
      name: "DataCorp Analytics",
      organization: "DataCorp Inc.",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "contact@datacorp.com",
    },
    {
      id: "2",
      name: "Research Institute",
      organization: "MIT Research Lab",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "research@mit.edu",
    },
    {
      id: "3",
      name: "TechFlow Solutions",
      organization: "TechFlow Corp",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "hello@techflow.com",
    },
  ]
  const availableDatasets: Dataset[] = [
    { id: "1", name: "Customer Behavior Analysis", type: "CSV", smpcReady: true },
    { id: "2", name: "Sales Performance Q4", type: "JSON", smpcReady: false },
    { id: "3", name: "Market Research Data", type: "XLSX", smpcReady: true },
  ]

  // Search/filter state & new-participant email input
  const [partnerSearch, setPartnerSearch] = useState("")
  const [newParticipantEmail, setNewParticipantEmail] = useState("")

  // Step definitions (used for header & progress bar)
  const steps = [
    { number: 1, title: "Basic Info", icon: Users },
    { number: 2, title: "Select Partners", icon: Users },
    { number: 3, title: "Select Datasets", icon: Database },
    { number: 4, title: "Invite Participants", icon: Mail },
    { number: 5, title: "Access Controls", icon: Shield },
  ]

  // Filter partners by name or organization
  const filteredPartners = availablePartners.filter(
    (p) =>
      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.organization.toLowerCase().includes(partnerSearch.toLowerCase())
  )

  // Toggle a partner in/out of selectedPartners
  const handlePartnerToggle = (partner: Partner) => {
    setFormData((prev) => {
      const already = prev.selectedPartners.some((p) => p.id === partner.id)
      return {
        ...prev,
        selectedPartners: already
          ? prev.selectedPartners.filter((p) => p.id !== partner.id)
          : prev.selectedPartners.concat(partner),
      }
    })
  }

  // Toggle a dataset in/out of selectedDatasets
  const handleDatasetToggle = (dataset: Dataset) => {
    if (!dataset.smpcReady) return
    setFormData((prev) => {
      const already = prev.selectedDatasets.some((d) => d.id === dataset.id)
      return {
        ...prev,
        selectedDatasets: already
          ? prev.selectedDatasets.filter((d) => d.id !== dataset.id)
          : prev.selectedDatasets.concat(dataset),
      }
    })
  }

  // Add a new participant by email
  const addParticipant = () => {
    if (
      newParticipantEmail &&
      !formData.participants.some((p) => p.email === newParticipantEmail)
    ) {
      setFormData((prev) => ({
        ...prev,
        participants: prev.participants.concat({
          email: newParticipantEmail,
          status: "pending",
          accessLevel: "read",
        }),
      }))
      setNewParticipantEmail("")
    }
  }

  // Change access level for a given participant
  const updateParticipantAccess = (
    email: string,
    accessLevel: "read" | "compute" | "manage"
  ) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.email === email ? { ...p, accessLevel } : p
      ),
    }))
  }

  // When we hit “Create Collaboration”
  const handleCreate = () => {
    const newCollab = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      purpose: formData.purpose,
      members: formData.selectedPartners.length + 1, // + you
      status: "pending",
      lastActivity: new Date().toISOString(),
      participants: formData.participants,
      datasets: formData.selectedDatasets,
    }
    onCreate(newCollab)
    onClose()
    // reset
    setCurrentStep(1)
    setFormData({
      name: "",
      description: "",
      purpose: "",
      selectedPartners: [],
      selectedDatasets: [],
      participants: [],
    })
  }

  // Only let them proceed when required fields for a step are filled
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.name && formData.description && formData.purpose)
      case 2:
        return formData.selectedPartners.length > 0
      case 3:
        return formData.selectedDatasets.length > 0
      case 4:
        return formData.participants.length > 0
      default:
        return true
    }
  }

  if (!isOpen) return null

  return (
    // Full-screen container
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Light-mode backdrop */}
      <div
        className="absolute inset-0 bg-gray-100/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal window */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Collaboration
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isActive = currentStep === step.number
              const isDone = currentStep > step.number
              const Icon = step.icon
              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                      isActive
                        ? "border-blue-500 bg-blue-100 text-blue-600"
                        : isDone
                        ? "border-green-500 bg-green-100 text-green-600"
                        : "border-gray-300 text-gray-500"
                    )}
                  >
                    {isDone ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-blue-600"
                          : isDone
                          ? "text-green-600"
                          : "text-gray-500"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-300 mx-4 hidden sm:block" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto max-h-[55vh] pr-4">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-700">
                  Collaboration Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter collaboration name"
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the collaboration"
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="purpose" className="text-gray-700">
                  Purpose *
                </Label>
                <Input
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="e.g., Joint market analysis"
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Partners */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Search bar */}
              <div>
                <Label className="text-gray-700">Search Partners</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={partnerSearch}
                    onChange={(e) => setPartnerSearch(e.target.value)}
                    placeholder="Search by name or org"
                    className="pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500"
                  />
                </div>
              </div>

              {/* ← NEW: scrollable list container */}
              <div className="overflow-y-auto max-h-[40vh] space-y-3">
                {filteredPartners.map((partner) => {
                  const selected = formData.selectedPartners.some((p) => p.id === partner.id)
                  return (
                    <div
                      key={partner.id}
                      onClick={() => handlePartnerToggle(partner)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                        selected
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={partner.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {partner.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{partner.name}</p>
                          <p className="text-sm text-gray-500">{partner.organization}</p>
                        </div>
                      </div>
                      {selected && <Check className="h-5 w-5 text-green-600" />}
                    </div>
                  )
                })}
              </div>

              {/* Selected partners badges */}
              {formData.selectedPartners.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Partners:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedPartners.map((p) => (
                      <Badge
                        key={p.id}
                        className="bg-green-100 text-green-600 border-green-200"
                      >
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Datasets */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700">Select Your Datasets</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Choose datasets to share
                </p>
              </div>
              <div className="space-y-3">
                {availableDatasets.map((dataset) => {
                  const selected = formData.selectedDatasets.some(
                    (d) => d.id === dataset.id
                  )
                  return (
                    <div
                      key={dataset.id}
                      onClick={() => handleDatasetToggle(dataset)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                        !dataset.smpcReady
                          ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                          : selected
                          ? "border-blue-200 bg-blue-50 cursor-pointer"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Database className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {dataset.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-gray-100 text-gray-600 text-xs border-gray-200">
                              {dataset.type}
                            </Badge>
                            {dataset.smpcReady ? (
                              <Badge className="bg-green-100 text-green-600 text-xs border-green-200">
                                SMPC Ready
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-600 text-xs border-yellow-200">
                                Not SMPC Ready
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {selected && <Check className="h-5 w-5 text-blue-600" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Invite Participants */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700">Invite Participants</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={newParticipantEmail}
                    onChange={(e) => setNewParticipantEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                    className="bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500"
                  />
                  <Button
                    onClick={addParticipant}
                    disabled={!newParticipantEmail}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {formData.participants.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-gray-700">Invited Participants</Label>
                  {formData.participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                            {p.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {p.email}
                          </p>
                          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200 text-xs">
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Access Controls */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-700">Access Control Settings</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Define access levels for each participant
                </p>
              </div>
              <div className="space-y-4">
                {formData.participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                          {p.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-gray-900">
                        {p.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {(["read", "compute", "manage"] as const).map((lvl) => (
                        <Button
                          key={lvl}
                          variant="outline"
                          size="sm"
                          onClick={() => updateParticipantAccess(p.email, lvl)}
                          className={cn(
                            "text-xs",
                            p.accessLevel === lvl
                              ? "border-blue-500 bg-blue-100 text-blue-600"
                              : "border-gray-300 text-gray-500 hover:border-gray-400"
                          )}
                        >
                          {lvl}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with navigation buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                Create Collaboration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
