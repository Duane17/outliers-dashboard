"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Calculator, Info, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatasetSelector } from "./dataset-selector";
import { cn } from "@/lib/utils";
import type { Dataset, ComputationConfig } from "@/types/computation";

interface ComputationFormProps {
  datasets: Dataset[];
  onSubmit: (config: ComputationConfig) => void;
  isSubmitting: boolean;
}

const computationTypes = [
  { id: "sum", label: "Sum", description: "Calculate total sum of selected columns" },
  { id: "average", label: "Average", description: "Calculate mean value across datasets" },
  { id: "count", label: "Count", description: "Count records matching criteria" },
  { id: "correlation", label: "Correlation", description: "Find relationships between variables" },
  { id: "group_by", label: "Group By", description: "Aggregate data by categories" },
  { id: "statistics", label: "Statistics", description: "Generate descriptive statistics" },
];

const privacyLevels = [
  {
    id: "strict",
    label: "Strict",
    description: "Maximum privacy protection, slower computation",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "Good balance of privacy and performance",
    color: "text-[#22D3A6]",
    bgColor: "bg-[#22D3A6]/10 border-[#22D3A6]/20",
  },
  {
    id: "fast",
    label: "Fast",
    description: "Optimized for speed, basic privacy protection",
    color: "text-[#3A6EFF]",
    bgColor: "bg-[#3A6EFF]/10 border-[#3A6EFF]/20",
  },
];

export function ComputationForm({ datasets, onSubmit, isSubmitting }: ComputationFormProps) {
  const [config, setConfig] = useState<ComputationConfig>({
    title: "",
    description: "",
    selectedDatasets: [],
    computationType: "",
    selectedColumns: [],
    filters: [],
    groupBy: [],
    privacyLevel: "balanced",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    if (!config.selectedDatasets.length) return setAvailableColumns([]);

    const selected = datasets.filter((d) => config.selectedDatasets.includes(d.id));
    if (!selected.length) return setAvailableColumns([]);

    const common = selected[0].columns
      .filter((col) =>
        selected.every((d) =>
          d.columns.some((c) => c.name === col.name && c.type === col.type)
        )
      )
      .map((c) => c.name);

    setAvailableColumns(common);
    setConfig((prev) => ({
      ...prev,
      selectedColumns: prev.selectedColumns.filter((c) => common.includes(c)),
    }));
  }, [config.selectedDatasets, datasets]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!config.title.trim()) newErrors.title = "Title is required";
    if (!config.selectedDatasets.length) newErrors.datasets = "At least one dataset must be selected";
    if (!config.computationType) newErrors.computationType = "Computation type is required";
    if (!config.selectedColumns.length) newErrors.columns = "At least one column must be selected";

    const nonSmpc = datasets
      .filter((d) => config.selectedDatasets.includes(d.id))
      .some((d) => !d.smpcReady);
    if (nonSmpc) newErrors.datasets = "All selected datasets must be SMPC ready";

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSubmit(config);
  };

  const handleColumnToggle = (col: string) => {
    setConfig((prev) => ({
      ...prev,
      selectedColumns: prev.selectedColumns.includes(col)
        ? prev.selectedColumns.filter((c) => c !== col)
        : [...prev.selectedColumns, col],
    }));
  };

  const isFormValid =
    !!config.title.trim() &&
    config.selectedDatasets.length &&
    !!config.computationType &&
    config.selectedColumns.length &&
    datasets
      .filter((d) => config.selectedDatasets.includes(d.id))
      .every((d) => d.smpcReady);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[#3A6EFF]" />
          Create New Computation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => setConfig((p) => ({ ...p, title: e.target.value }))}
                placeholder="Enter computation title..."
                className={cn(
                  "bg-white border border-slate-300 text-slate-900 focus:border-[#3A6EFF] focus:ring-[#3A6EFF]/20",
                  errors.title && "border-red-400 focus:border-red-400"
                )}
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig((p) => ({ ...p, description: e.target.value }))}
                placeholder="Optional description of your computation..."
                rows={3}
                className="bg-white border border-slate-300 text-slate-900 focus:border-[#3A6EFF] focus:ring-[#3A6EFF]/20"
              />
            </div>
          </div>

          {/* Dataset Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Datasets</h3>
              {errors.datasets && <p className="text-red-400 text-sm mb-2">{errors.datasets}</p>}
            </div>
            <DatasetSelector
              datasets={datasets}
              selectedDatasets={config.selectedDatasets}
              onSelectionChange={(ids) => setConfig((p) => ({ ...p, selectedDatasets: ids }))}
            />
          </div>

          {/* Computation Type */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Computation Type</h3>
              {errors.computationType && <p className="text-red-400 text-sm mb-2">{errors.computationType}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {computationTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, computationType: t.id }))}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all duration-200",
                    config.computationType === t.id
                      ? "border-[#3A6EFF]/50 bg-[#3A6EFF]/10 text-white"
                      : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  <h4 className="font-medium mb-1">{t.label}</h4>
                  <p className="text-xs text-slate-600">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Column Selection */}
          {availableColumns.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Select Columns</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Choose columns available across all selected datasets
                </p>
                {errors.columns && <p className="text-red-400 text-sm mb-2">{errors.columns}</p>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableColumns.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleColumnToggle(col)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-all duration-200",
                      config.selectedColumns.includes(col)
                        ? "border-[#22D3A6]/50 bg-[#22D3A6]/10 text-[#22D3A6]"
                        : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Level */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Privacy Level</h3>
              <p className="text-sm text-slate-600 mb-2">
                Balance privacy protection and computation speed
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {privacyLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, privacyLevel: lvl.id as any }))}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all duration-200",
                    config.privacyLevel === lvl.id
                      ? `${lvl.bgColor} border-current`
                      : "border-slate-300 bg-white hover:border-slate-400"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield
                      className={cn(
                        "h-4 w-4",
                        config.privacyLevel === lvl.id ? lvl.color : "text-slate-400"
                      )}
                    />
                    <h4
                      className={cn(
                        "font-medium",
                        config.privacyLevel === lvl.id ? lvl.color : "text-slate-800"
                      )}
                    >
                      {lvl.label}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">{lvl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* SMPC Info Panel */}
          <div className="bg-white/80 border border-slate-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#22D3A6] mt-0.5" />
              <div>
                <h4 className="font-medium text-slate-900 mb-1">SMPC Protocol Information</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Your computation will use Secure Multi-Party Computation (SMPC) v2.1 with AES-256 encryption.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Protocol: SMPC v2.1</span>
                  <span>Encryption: AES-256</span>
                  <span>Privacy Level: {config.privacyLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {!isFormValid && (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <span>Please complete all required fields</span>
                </>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={cn(
                "bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] text-white font-medium px-8 py-2 rounded-lg transition-all duration-200",
                isFormValid && !isSubmitting
                  ? "hover:opacity-90 hover:shadow-lg"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Starting Computation...</span>
                </div>
              ) : (
                "Run Computation"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
