"use client"

import { Book, Play, ArrowRight, Zap, Users, BarChart3 } from "lucide-react"

export function DocumentationSection() {
  const quickStartGuides = [
    {
      icon: Zap,
      title: "Quick Start",
      description: "Get up and running in 5 minutes",
      time: "5 min read",
    },
    {
      icon: Users,
      title: "Your First Collaboration",
      description: "Learn how to invite and work with others",
      time: "10 min read",
    },
    {
      icon: BarChart3,
      title: "Understanding Results",
      description: "How to interpret your insights",
      time: "8 min read",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Documentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/40 p-6 group hover:border-[#3A6EFF]/30 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#3A6EFF]/10 rounded-lg group-hover:bg-[#3A6EFF]/20 transition-colors">
              <Book className="h-6 w-6 text-[#3A6EFF]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Documentation</h3>
          </div>

          <p className="text-slate-400 mb-4 leading-relaxed">
            Comprehensive guides, API references, and tutorials to help you make the most of Outliers.
          </p>

          <button className="flex items-center gap-2 text-[#3A6EFF] hover:text-[#22D3A6] font-medium transition-colors group">
            Read the Docs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/40 p-6 group hover:border-[#22D3A6]/30 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#22D3A6]/10 rounded-lg group-hover:bg-[#22D3A6]/20 transition-colors">
              <Play className="h-6 w-6 text-[#22D3A6]" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Guided Tour</h3>
          </div>

          <p className="text-slate-400 mb-4 leading-relaxed">
            New to Outliers? Take an interactive tour to learn the basics in just a few clicks.
          </p>

          <button className="flex items-center gap-2 text-[#22D3A6] hover:text-[#3A6EFF] font-medium transition-colors group">
            Take the Tour
            <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>

      {/* Quick Start Guides */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/40 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Start Guides</h3>

        <div className="grid gap-3">
          {quickStartGuides.map((guide, index) => {
            const Icon = guide.icon
            return (
              <a
                key={index}
                href="#"
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group"
              >
                <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#3A6EFF]/10 transition-colors">
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#3A6EFF] transition-colors" />
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-slate-100 group-hover:text-[#22D3A6] transition-colors">
                    {guide.title}
                  </h4>
                  <p className="text-sm text-slate-400">{guide.description}</p>
                </div>

                <span className="text-xs text-slate-500 font-medium">{guide.time}</span>

                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-[#22D3A6] transition-all group-hover:translate-x-1" />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
