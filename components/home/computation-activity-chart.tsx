"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import { cn } from "@/lib/utils"

export function ComputationActivityChart() {
  const [timeRange, setTimeRange] = useState("7d")

  const data = {
    "7d": [
      { day: "Mon", computations: 45, insights: 12, collaborations: 8 },
      { day: "Tue", computations: 52, insights: 15, collaborations: 11 },
      { day: "Wed", computations: 38, insights: 9, collaborations: 6 },
      { day: "Thu", computations: 61, insights: 18, collaborations: 13 },
      { day: "Fri", computations: 55, insights: 16, collaborations: 10 },
      { day: "Sat", computations: 29, insights: 7, collaborations: 4 },
      { day: "Sun", computations: 33, insights: 8, collaborations: 5 },
    ],
    "30d": [
      { day: "Week 1", computations: 280, insights: 75, collaborations: 45 },
      { day: "Week 2", computations: 320, insights: 85, collaborations: 52 },
      { day: "Week 3", computations: 295, insights: 78, collaborations: 48 },
      { day: "Week 4", computations: 340, insights: 92, collaborations: 58 },
    ],
  }

  const currentData = data[timeRange as keyof typeof data]
  const maxValue = Math.max(...currentData.flatMap((d) => [d.computations, d.insights, d.collaborations]))

  return (
    <Card className="bg-white border hover:shadow-sm transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Activity className="h-5 w-5 text-[#3A6EFF]" />
          Computation Activity
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRange("7d")}
            className={cn(
              "text-xs px-3 py-1 h-7",
              timeRange === "7d"
                ? "bg-[#3A6EFF]/20 text-[#3A6EFF] border border-[#3A6EFF]/30"
                : "text-gray-500 hover:text-[#3A6EFF]",
            )}
          >
            7 Days
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTimeRange("30d")}
            className={cn(
              "text-xs px-3 py-1 h-7",
              timeRange === "30d"
                ? "bg-[#3A6EFF]/20 text-[#3A6EFF] border border-[#3A6EFF]/30"
                : "text-gray-500 hover:text-[#3A6EFF]",
            )}
          >
            30 Days
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3A6EFF]"></div>
              <span>Computations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22D3A6]"></div>
              <span>Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Collaborations</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 flex items-end justify-between gap-2">
            {currentData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-1 h-40">
                  {/* Computations */}
                  <div
                    className="w-full bg-gradient-to-t from-[#3A6EFF]/60 to-[#3A6EFF] rounded-t-sm transition-all duration-500 hover:from-[#3A6EFF]/80 hover:to-[#3A6EFF] group relative"
                    style={{ height: `${(item.computations / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.computations}
                    </div>
                  </div>

                  {/* Insights */}
                  <div
                    className="w-full bg-gradient-to-t from-[#22D3A6]/60 to-[#22D3A6] transition-all duration-500 hover:from-[#22D3A6]/80 hover:to-[#22D3A6] group relative"
                    style={{ height: `${(item.insights / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.insights}
                    </div>
                  </div>

                  {/* Collaborations */}
                  <div
                    className="w-full bg-gradient-to-t from-gray-400/60 to-gray-400 rounded-b-sm transition-all duration-500 hover:from-gray-400/80 hover:to-gray-400 group relative"
                    style={{ height: `${(item.collaborations / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.collaborations}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
