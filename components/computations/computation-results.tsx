"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  Share2,
  RefreshCw,
  Table,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComputationResult } from "@/types/computation";

interface ComputationResultsProps {
  results: ComputationResult;
  onRerun: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function ComputationResults({
  results,
  onRerun,
  onExport,
  onShare,
}: ComputationResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  const formatNumber = (num: number) =>
    new Intl.NumberFormat().format(num);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}m ${sec}s`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#22D3A6]" />
            Computation Results
          </CardTitle>
          <Badge className="bg-[#22D3A6]/10 text-[#22D3A6] border-[#22D3A6]/20">
            Completed Successfully
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 rounded-md">
            {[
              { value: "summary", Icon: TrendingUp, label: "Summary" },
              { value: "charts", Icon: BarChart3, label: "Charts" },
              { value: "data", Icon: Table, label: "Full Data" },
            ].map(({ value, Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-slate-600 data-[state=active]:bg-[#3A6EFF]/20 data-[state=active]:text-[#3A6EFF]"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Records Processed",
                  value: formatNumber(results.summary.recordCount),
                  Icon: Table,
                  bg: "bg-[#3A6EFF]/10",
                  iconColor: "text-[#3A6EFF]",
                  textColor: "text-slate-900",
                },
                {
                  label: "Computed Value",
                  value: String(results.summary.computedValue),
                  Icon: TrendingUp,
                  bg: "bg-[#22D3A6]/10",
                  iconColor: "text-[#22D3A6]",
                  textColor: "text-slate-900",
                },
                {
                  label: "Execution Time",
                  value: formatDuration(results.summary.executionTime),
                  Icon: RefreshCw,
                  bg: "bg-slate-200/50",
                  iconColor: "text-slate-600",
                  textColor: "text-slate-900",
                },
              ].map(({ label, value, Icon, bg, iconColor, textColor }) => (
                <Card
                  key={label}
                  className="bg-white border border-slate-200 shadow-sm"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{label}</p>
                      <p className={`text-2xl font-bold ${textColor}`}>
                        {value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}
                    >
                      <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 text-lg">
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      color: "bg-[#22D3A6]",
                      text: `Computation completed successfully across ${formatNumber(
                        results.summary.recordCount
                      )} records`,
                    },
                    {
                      color: "bg-[#3A6EFF]",
                      text:
                        "All data remained encrypted throughout the computation process",
                    },
                    {
                      color: "bg-slate-400",
                      text:
                        "Results are ready for export and sharing with authorized parties",
                    },
                  ].map(({ color, text }, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`${color} w-2 h-2 rounded-full mt-2`} />
                      <p className="text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 text-lg">
                  Result Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-600">
                      Chart visualization would appear here
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Based on your computation results
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900 text-lg">
                    Full Results Table
                  </CardTitle>
                  <Badge className="bg-slate-100 text-slate-700">
                    {results.data.length} rows
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {Object.keys(results.data[0] || {}).map((key) => (
                          <th
                            key={key}
                            className="text-left py-3 px-4 text-slate-600 font-medium"
                          >
                            {key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.data.slice(0, 10).map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          {Object.values(row).map((val, ci) => (
                            <td
                              key={ci}
                              className="py-3 px-4 text-slate-700"
                            >
                              {typeof val === "number"
                                ? formatNumber(val)
                                : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.data.length > 10 && (
                    <div className="text-center py-4 text-slate-600 text-sm">
                      Showing 10 of {results.data.length} rows. Export for full
                      dataset.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Button
              onClick={onExport}
              className="bg-[#22D3A6]/10 text-[#22D3A6] border border-[#22D3A6]/20 hover:bg-[#22D3A6]/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={onShare}
              variant="outline"
              className="border border-slate-200 text-slate-600 hover:bg-slate-50 bg-transparent"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
          <Button
            onClick={onRerun}
            className="bg-[#3A6EFF]/10 text-[#3A6EFF] border border-[#3A6EFF]/20 hover:bg-[#3A6EFF]/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rerun Computation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
