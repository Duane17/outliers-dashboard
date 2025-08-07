"use client"

import { useState } from "react"
import { X, Play, Settings, Database, Eye, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SMPCJobWizardProps {
  isOpen: boolean
  onClose: () => void
  collaborationId: string
  onLaunch: (job: any) => void
}

export function SMPCJobWizard({ isOpen, onClose, collaborationId, onLaunch }: SMPCJobWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [jobData, setJobData] = useState({
    goal: "",
    computationType: "",
    selectedDatasets: [] as string[],
    parameters: {} as Record<string, any>,
  })

  const computationTypes = [
    { id: "sum", name: "Sum", description: "Calculate sum across datasets" },
    { id: "average", name: "Average", description: "Calculate average values" },
    { id: "correlation", name: "Correlation", description: "Find correlations between variables" },
    { id: "count", name: "Count occurrences or records" },
    { id: "statistics", name: "Statistics", description: "Generate statistical summaries" },
  ]

  const availableDatasets = [
    { id: "1", name: "Customer Behavior Analysis", owner: "You", columns: ["age", "purchase_amount", "location"] },
    {
      id: "2",
      name: "Market Research Data",
      owner: "DataCorp Analytics",
      columns: ["income", "preferences", "demographics"],
    },
    { id: "3", name: "Sales Performance", owner: "Research Institute", columns: ["revenue", "product_type", "region"] },
  ]

  const steps = [
    { number: 1, title: "Define Goal", icon: Settings },
    { number: 2, title: "Select Datasets", icon: Database },
    { number: 3, title: "Configure Parameters", icon: Settings },
    { number: 4, title: "Review & Launch", icon: Play },
  ]

  const handleDatasetToggle = (datasetId: string) => {
    const isSelected = jobData.selectedDatasets.includes(datasetId)
    setJobData({
      ...jobData,
      selectedDatasets: isSelected
        ? jobData.selectedDatasets.filter((id) => id !== datasetId)
        : [...jobData.selectedDatasets, datasetId],
    })
  }

  const handleLaunch = () => {
    const newJob = {
      id: Date.now().toString(),
      collaborationId,
      goal: jobData.goal,
      computationType: jobData.computationType,
      datasets: jobData.selectedDatasets,
      parameters: jobData.parameters,
      status: "running",
      createdAt: new Date().toISOString(),
      progress: 0,
    }
    onLaunch(newJob)
    onClose()
    setCurrentStep(1)
    setJobData({ goal: "", computationType: "", selectedDatasets: [], parameters: {} })
  }

  const canProceed = () => {
    if (currentStep === 1) return jobData.goal && jobData.computationType
    if (currentStep === 2) return jobData.selectedDatasets.length > 0
    return true
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal container: light background, rounded, shadow, scrollable */}
      <div className="relative w-full max-w-3xl mx-4 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-[90vh] overflow-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SMPC Job Setup</h2>
            <p className="text-sm text-gray-600 mt-1">Configure secure multi-party computation</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200",
                      isActive
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : isCompleted
                        ? "border-green-500 bg-green-50 text-green-500"
                        : "border-gray-200 text-gray-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={cn("text-sm font-medium", isActive ? "text-blue-600" : isCompleted ? "text-green-500" : "text-gray-500")}>
                      {step.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && <ChevronRight className="h-4 w-4 text-gray-300 mx-4 hidden sm:block" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="goal" className="text-gray-900">Computation Goal</Label>
                <Input
                  id="goal"
                  value={jobData.goal}
                  onChange={(e) => setJobData({ ...jobData, goal: e.target.value })}
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                  placeholder="e.g., Calculate average customer lifetime value"
                />
              </div>

              <div>
                <Label className="text-gray-900">Computation Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {computationTypes.map((type) => {
                    const selected = jobData.computationType === type.id
                    return (
                      <div
                        key={type.id}
                        onClick={() => setJobData({ ...jobData, computationType: type.id })}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        <h3 className="font-medium text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-900">Select Participating Datasets</Label>
                <p className="text-sm text-gray-600 mt-1">Choose datasets from collaboration members</p>
              </div>

              <div className="space-y-3">
                {availableDatasets.map((dataset) => {
                  const selected = jobData.selectedDatasets.includes(dataset.id)
                  return (
                    <div
                      key={dataset.id}
                      onClick={() => handleDatasetToggle(dataset.id)}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                        selected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                          <p className="text-sm text-gray-600">Owner: {dataset.owner}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {dataset.columns.slice(0, 3).map((col) => (
                              <Badge key={col} variant="secondary" className="text-xs">{col}</Badge>
                            ))}
                            {dataset.columns.length > 3 && <Badge variant="secondary" className="text-xs">
                              +{dataset.columns.length - 3}
                            </Badge>}
                          </div>
                        </div>
                        {selected && (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-900">Computation Parameters</Label>
                <p className="text-sm text-gray-600 mt-1">Configure specific parameters for your computation</p>
              </div>

              {jobData.computationType === "correlation" && (
                <div>
                  <Label htmlFor="threshold" className="text-gray-900">Correlation Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={jobData.parameters.threshold || ""}
                    onChange={(e) =>
                      setJobData({ ...jobData, parameters: { ...jobData.parameters, threshold: e.target.value } })
                    }
                    className="mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                    placeholder="0.5"
                  />
                </div>
              )}

              {jobData.computationType === "statistics" && (
                <div>
                  <Label className="text-gray-900">Statistics to Calculate</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["mean", "median", "std", "variance"].map((stat) => (
                      <label key={stat} className="flex items-center gap-2 text-gray-700">
                        <input
                          type="checkbox"
                          checked={jobData.parameters.statistics?.includes(stat) || false}
                          onChange={(e) => {
                            const curr = jobData.parameters.statistics || []
                            const updated = e.target.checked ? [...curr, stat] : curr.filter((s: string) => s !== stat)
                            setJobData({ ...jobData, parameters: { ...jobData.parameters, statistics: updated } })
                          }}
                          className="rounded border-gray-300 bg-white"
                        />
                        {stat}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Privacy Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" disabled />
                    Enable differential privacy
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" disabled />
                    Secure aggregation
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-900">Review Configuration</Label>
                <p className="text-sm text-gray-600 mt-1">Verify your SMPC job settings before launch</p>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-gray-900 text-lg">Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="text-gray-900">{jobData.goal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Computation Type</p>
                    <Badge className="border-blue-600 text-blue-600 bg-blue-50">
                      {computationTypes.find((t) => t.id === jobData.computationType)?.name}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Selected Datasets</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {jobData.selectedDatasets.map((id) => {
                        const ds = availableDatasets.find((d) => d.id === id)
                        return (
                          <Badge key={id} className="border-green-500 text-green-500 bg-green-50">
                            {ds?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Privacy Guarantee</p>
                    <p className="text-xs text-gray-700 mt-1">
                      This computation will be executed using secure multi-party computation protocols. Individual
                      data points will remain private and only aggregate results will be shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="text-gray-600 hover:text-gray-900">
              Cancel
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep((s) => s + 1)}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleLaunch} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Launch Job
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
