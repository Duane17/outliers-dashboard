"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Computation } from "@/types/computation";

const statusConfig = {
  queued: {
    icon: Clock,
    label: "Queued",
    color: "text-slate-500",
    bgColor: "bg-slate-200 border-slate-300",
  },
  running: {
    icon: Loader2,
    label: "Running",
    color: "text-[#3A6EFF]",
    bgColor: "bg-[#3A6EFF]/10 border-[#3A6EFF]/20",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    color: "text-[#22D3A6]",
    bgColor: "bg-[#22D3A6]/10 border-[#22D3A6]/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/20",
  },
};

export function ComputationHistory({
  computations,
  onViewResults,
  onRerun,
}: {
  computations: Computation[];
  onViewResults: (c: Computation) => void;
  onRerun: (c: Computation) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = computations.filter((c) => {
    const matchText =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "all" || c.status === statusFilter;
    return matchText && matchStatus;
  });

  const timeAgo = (date: Date) => {
    const now = new Date();
    const mins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center justify-between">
          <span>Computation History</span>
          <Badge className="bg-slate-100 text-slate-700">
            {computations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 text-slate-500 -translate-y-1/2" />
            <Input
              placeholder="Search computations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border border-slate-300 text-slate-900 focus:border-[#3A6EFF] focus:ring-[#3A6EFF]/20"
            />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "running", "failed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors",
                  statusFilter === s
                    ? "bg-[#3A6EFF]/20 text-[#3A6EFF] border border-[#3A6EFF]/30"
                    : "bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Computation List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-600">No computations found</p>
            </div>
          ) : (
            filtered.map((c) => {
              const cfg = statusConfig[c.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={c.id}
                  className="p-3 bg-white/50 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {c.title}
                      </h4>
                      {c.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <Badge className={cn("ml-2 flex-shrink-0", cfg.bgColor, cfg.color)}>
                      <Icon
                        className={cn(
                          "h-3 w-3 mr-1",
                          cfg.color,
                          c.status === "running" && "animate-spin"
                        )}
                      />
                      {cfg.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{timeAgo(c.createdAt)}</span>
                      <span>•</span>
                      <span>{c.config.selectedDatasets.length} datasets</span>
                      <span>•</span>
                      <span className="capitalize">
                        {c.config.computationType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {c.status === "completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewResults(c)}
                          className="h-7 px-2 text-[#3A6EFF] hover:text-[#22D3A6] hover:bg-[#3A6EFF]/10"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRerun(c)}
                        className="h-7 px-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Rerun
                      </Button>
                    </div>
                  </div>

                  {c.status === "running" && c.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-slate-700">
                          {c.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1">
                        <div
                          className="bg-[#3A6EFF] h-1 rounded-full transition-all duration-300"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
