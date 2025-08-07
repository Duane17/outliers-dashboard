"use client";

import { Clock, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComputationStatusProps {
  status: "queued" | "running" | "completed" | "failed";
  progress?: number;
  error?: string;
}

const statusConfig = {
  queued: {
    icon: Clock,
    label: "Queued",
    description: "Your computation is waiting to be processed",
    color: "text-slate-600",
    bgColor: "bg-slate-100 border-slate-200",
  },
  running: {
    icon: Loader2,
    label: "Running",
    description: "SMPC computation is in progress",
    color: "text-[#3A6EFF]",
    bgColor: "bg-[#3A6EFF]/10 border-[#3A6EFF]/20",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    description: "Computation finished successfully",
    color: "text-[#22D3A6]",
    bgColor: "bg-[#22D3A6]/10 border-[#22D3A6]/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    description: "Computation encountered an error",
    color: "text-red-500",
    bgColor: "bg-red-100 border-red-200",
  },
};

export function ComputationStatus({
  status,
  progress = 0,
  error,
}: ComputationStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center justify-between">
          <span>Computation Status</span>
          <Badge className={cn("flex items-center gap-2", config.bgColor)}>
            <Icon
              className={cn(
                "h-4 w-4",
                config.color,
                status === "running" && "animate-spin"
              )}
            />
            <span className={config.color}>{config.label}</span>
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Description */}
        <div className="text-center">
          <div
            className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-white/80 border border-slate-200",
              config.bgColor
            )}
          >
            <Icon
              className={cn(
                "h-8 w-8",
                config.color,
                status === "running" && "animate-spin"
              )}
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {config.label}
          </h3>
          <p className="text-slate-600">{config.description}</p>
        </div>

        {/* Progress Bar */}
        {status === "running" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="text-slate-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-600 text-center">
              Secure computation in progress using SMPC protocol...
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600">
            Process Timeline
          </h4>
          <div className="space-y-2">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#22D3A6] rounded-full" />
              <span className="text-sm text-slate-700">Computation queued</span>
              <span className="text-xs text-slate-500 ml-auto">✓</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "queued"
                    ? "bg-slate-300"
                    : "bg-[#3A6EFF]"
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  status === "queued" ? "text-slate-500" : "text-slate-700"
                )}
              >
                SMPC protocol initialized
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {status !== "queued" ? "✓" : "⏳"}
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "running"
                    ? "bg-[#3A6EFF] animate-pulse"
                    : status === "completed"
                    ? "bg-[#22D3A6]"
                    : status === "failed"
                    ? "bg-red-500"
                    : "bg-slate-300"
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  ["running", "completed", "failed"].includes(status)
                    ? "text-slate-700"
                    : "text-slate-500"
                )}
              >
                Processing encrypted data
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {status === "completed"
                  ? "✓"
                  : status === "failed"
                  ? "✗"
                  : "⏳"}
              </span>
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "completed"
                    ? "bg-[#22D3A6]"
                    : status === "failed"
                    ? "bg-red-500"
                    : "bg-slate-300"
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  ["completed", "failed"].includes(status)
                    ? "text-slate-700"
                    : "text-slate-500"
                )}
              >
                {status === "failed"
                  ? "Computation failed"
                  : "Results generated"}
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {status === "completed"
                  ? "✓"
                  : status === "failed"
                  ? "✗"
                  : "⏳"}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {status === "failed" && error && (
          <div className="bg-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-600 mb-1">
                  Computation Failed
                </h4>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Running Details */}
        {status === "running" && (
          <div className="bg-[#3A6EFF]/10 border border-[#3A6EFF]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Loader2 className="h-5 w-5 text-[#3A6EFF] mt-0.5 flex-shrink-0 animate-spin" />
              <div>
                <h4 className="font-medium text-[#3A6EFF] mb-1">
                  Secure Computation Active
                </h4>
                <p className="text-sm text-slate-700 mb-2">
                  Your data is being processed using advanced cryptographic protocols. No raw data is shared between
                  parties.
                </p>
                <div className="text-xs text-slate-600">
                  Estimated completion:{" "}
                  {Math.max(1, Math.ceil((100 - progress) / 10))} minutes remaining
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
