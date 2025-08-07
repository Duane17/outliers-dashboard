"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Shield, Info } from "lucide-react"
import { ComputationForm } from "./computation-form"
import { ComputationStatus } from "./computation-status"
import { ComputationResults } from "./computation-results"
import { ComputationHistory } from "./computation-history"
import type {
  Dataset,
  Computation,
  ComputationConfig,
  ComputationResult,
} from "@/types/computation"

export function ComputationsPage() {
  // --- State hooks ---
  const [currentComputation, setCurrentComputation] = useState<Computation | null>(null)
  const [computationHistory, setComputationHistory] = useState<Computation[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null);


  // --- Mock datasets (memoized so we don’t recreate on every render) ---
  const mockDatasets: Dataset[] = useMemo(
    () => [
      {
        id: "1",
        name: "Customer Behavior Analysis",
        owner: "You",
        size: 15_728_640,
        tags: ["customer", "behavior", "analytics"],
        columns: [
          { name: "user_id", type: "string", nullable: false },
          { name: "age", type: "number", nullable: false },
          { name: "purchase_amount", type: "number", nullable: false },
          { name: "location", type: "string", nullable: true },
          { name: "signup_date", type: "date", nullable: false },
        ],
        smpcReady: true,
        shared: false,
      },
      {
        id: "2",
        name: "Market Research Data",
        owner: "DataCorp Analytics",
        size: 31_457_280,
        tags: ["market", "research", "survey"],
        columns: [
          { name: "respondent_id", type: "string", nullable: false },
          { name: "age", type: "number", nullable: false },
          { name: "income", type: "number", nullable: true },
          { name: "preferences", type: "string", nullable: false },
          { name: "location", type: "string", nullable: false },
        ],
        smpcReady: true,
        shared: true,
      },
      {
        id: "3",
        name: "Sales Performance Q4",
        owner: "Research Institute",
        size: 8_388_608,
        tags: ["sales", "quarterly", "performance"],
        columns: [
          { name: "product_id", type: "string", nullable: false },
          { name: "revenue", type: "number", nullable: false },
          { name: "units_sold", type: "number", nullable: false },
          { name: "region", type: "string", nullable: false },
        ],
        smpcReady: false,
        shared: true,
      },
    ],
    []
  )

  // --- Load initial history once ---
  useEffect(() => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    setComputationHistory([
      {
        id: "hist-1",
        title: "Customer Age Analysis",
        description: "Average age calculation across customer segments",
        status: "completed",
        config: {
          title: "Customer Age Analysis",
          description: "Average age calculation across customer segments",
          selectedDatasets: ["1", "2"],
          computationType: "average",
          selectedColumns: ["age"],
          filters: [],
          groupBy: [],
          privacyLevel: "balanced",
        },
        createdAt: new Date(twoHoursAgo),
        completedAt: new Date(twoHoursAgo + 3 * 60 * 1000),
        results: {
          summary: {
            recordCount: 125000,
            computedValue: 34.7,
            executionTime: 180,
          },
          data: [
            { segment: "Premium", average_age: 42.3, count: 25000 },
            { segment: "Standard", average_age: 31.2, count: 75000 },
            { segment: "Basic", average_age: 28.9, count: 25000 },
          ],
        },
      },
      {
        id: "hist-2",
        title: "Revenue Correlation Study",
        description: "Correlation between customer age and purchase amount",
        status: "failed",
        config: {
          title: "Revenue Correlation Study",
          description: "Correlation between customer age and purchase amount",
          selectedDatasets: ["1"],
          computationType: "correlation",
          selectedColumns: ["age", "purchase_amount"],
          filters: [],
          groupBy: [],
          privacyLevel: "strict",
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        error: "Data mismatch: Selected columns have incompatible types.",
      },
    ])
  }, [])

  // --- Submit a new computation (simulated with timeouts) ---
  const handleSubmitComputation = useCallback(
    async (config: ComputationConfig) => {
      setIsSubmitting(true);

      const base: Computation = {
        id: `comp-${Date.now()}`,
        title: config.title,
        description: config.description,
        status: "queued",
        config,
        createdAt: new Date(),
        progress: 0,
      };

      setCurrentComputation(base);

      // Delay scroll to allow status section to render
      setTimeout(() => {
        const offset = 100; // Adjust to match your header height
        if (resultsRef.current) {
          const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);


      const timeouts: NodeJS.Timeout[] = [];
      timeouts.push(
        setTimeout(() => setCurrentComputation((p) => p && { ...p, status: "running", progress: 10 }), 1000)
      );
      timeouts.push(
        setTimeout(() => setCurrentComputation((p) => p && { ...p, progress: 45 }), 3000)
      );
      timeouts.push(
        setTimeout(() => setCurrentComputation((p) => p && { ...p, progress: 80 }), 5000)
      );
      timeouts.push(
        setTimeout(() => {
          const mockResults: ComputationResult = {
            summary: {
              recordCount: 50000 + Math.floor(Math.random() * 100000),
              computedValue: Math.round((Math.random() * 100 + 20) * 100) / 100,
              executionTime: 120 + Math.floor(Math.random() * 180),
            },
            data: [
              { category: "Group A", value: 45.2, count: 15000 },
              { category: "Group B", value: 38.7, count: 22000 },
              { category: "Group C", value: 52.1, count: 18000 },
            ],
            charts: [{ type: "bar", title: "Results by Category", data: [] }],
          };

          const done: Computation = {
            ...base,
            status: "completed",
            progress: 100,
            completedAt: new Date(),
            results: mockResults,
          };

          setCurrentComputation(done);
          setComputationHistory((h) => [done, ...h]);
          setIsSubmitting(false);
        }, 7000)
      );

      return () => timeouts.forEach(clearTimeout);
    },
    []
  );


  // --- Handlers for viewing, rerunning, exporting, sharing, and resetting ---
  const handleViewResults = useCallback((c: Computation) => setCurrentComputation(c), [])
  const handleRerun = useCallback((c: Computation) => handleSubmitComputation(c.config), [
    handleSubmitComputation,
  ])
  const handleExport = useCallback(() => console.log("Exporting..."), [])
  const handleShare = useCallback(() => console.log("Sharing..."), [])
  const handleStartNew = useCallback(() => {
    setCurrentComputation(null)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 50) 
  }, [])


  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Secure Computations</h1>
          <p className="text-gray-600 mt-1">
            Run privacy-preserving computations using Secure Multi-Party Computation (SMPC)
          </p>
        </div>
      </div>

      {/* Privacy Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔐 No raw data shared. All computations run using SMPC.
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Your data stays private — even we can’t see it. Computation happens without raw data leaving your
              device, using SMPC protocols to ensure complete privacy.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                Read Technical Whitepaper →
              </a>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info className="h-3 w-3" />
                <span>SMPC Protocol v2.1 • AES-256 Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main + Sidebar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Form */}
          {!currentComputation && (
            <ComputationForm
              datasets={mockDatasets}
              onSubmit={handleSubmitComputation}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Status */}
          {currentComputation && currentComputation.status !== "completed" && (
            <div ref={resultsRef}>
              <ComputationStatus
                status={currentComputation?.status || "queued"}
                progress={currentComputation?.progress}
                error={currentComputation?.error}
              />
            </div>
          )}

          {/* Results */}
          {currentComputation?.status === "completed" && currentComputation.results && (
            <ComputationResults
              results={currentComputation.results}
              onRerun={() => handleRerun(currentComputation)}
              onExport={handleExport}
              onShare={handleShare}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Computation Log */}
          {currentComputation && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Computation Log</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <LogEntry
                  label="Computation initiated"
                  time={currentComputation.createdAt.toLocaleTimeString()}
                  color="green"
                />
                {currentComputation.status !== "queued" && (
                  <LogEntry label="SMPC protocol initialized" color="blue" />
                )}
                {currentComputation.status === "running" && (
                  <LogEntry label="Processing encrypted data…" color="blue" pulse />
                )}
                {currentComputation.status === "completed" && (
                  <>
                    <LogEntry
                      label="Computation completed"
                      time={currentComputation.completedAt?.toLocaleTimeString()}
                      color="green"
                    />
                    <LogEntry label="Results encrypted and secured" color="green" />
                  </>
                )}
                {currentComputation.status === "failed" && (
                  <LogEntry label="Computation failed" color="red" />
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs grid grid-cols-2 gap-4 text-gray-600">
                <Stat label="Datasets" value={currentComputation.config.selectedDatasets.length} />
                <Stat label="Privacy Level" value={currentComputation.config.privacyLevel} capitalize />
                <Stat label="Protocol" value="SMPC v2.1" />
                <Stat
                  label="Participants"
                  value={currentComputation.config.selectedDatasets.length}
                />
              </div>
            </div>
          )}

          {/* History List */}
          <ComputationHistory
            computations={computationHistory}
            onViewResults={handleViewResults}
            onRerun={handleRerun}
          />
        </div>
      </div>

      {/* Start New Button */}
      {currentComputation && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleStartNew}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Start New Computation
          </button>
        </div>
      )}
    </div>
  )
}

// Helper sub-components to keep the markup concise:
function LogEntry({
  label,
  time,
  color,
  pulse,
}: {
  label: string
  time?: string
  color: "green" | "blue" | "red"
  pulse?: boolean
}) {
  const dotColor =
    color === "green" ? "bg-green-600" : color === "blue" ? "bg-blue-600" : "bg-red-600"
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-2 h-2 rounded-full ${dotColor}
          ${pulse ? "animate-pulse" : ""}
        `}
      />
      <span>{label}</span>
      {time && <span className="ml-auto text-gray-500">{time}</span>}
    </div>
  )
}

function Stat({
  label,
  value,
  capitalize,
}: {
  label: string
  value: number | string
  capitalize?: boolean
}) {
  const text = typeof value === "string" && capitalize ? `${String(value).charAt(0).toUpperCase()}${String(value).slice(1)}` : value
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  )
}
