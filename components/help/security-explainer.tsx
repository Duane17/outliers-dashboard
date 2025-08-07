"use client"

import { Shield, Lock, Eye, FileText, ExternalLink } from "lucide-react"

export function SecurityExplainer() {
  return (
    <div className="bg-gradient-to-br from-[#3A6EFF]/5 to-[#22D3A6]/5 backdrop-blur-sm rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-[#3A6EFF]/10 to-[#22D3A6]/10 rounded-lg">
          <Shield className="h-6 w-6 text-[#22D3A6]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">How Secure is This?</h2>
      </div>

      {/* Intro */}
      <p className="text-slate-700 mb-6 leading-relaxed">
        We know security is your top concern when sharing data. Here's how Outliers keeps your information safe:
      </p>

      {/* Bullet Sections */}
      <div className="grid gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#22D3A6]/10 rounded-lg mt-1">
            <Lock className="h-5 w-5 text-[#22D3A6]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Your data stays private — even we can't see it</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All data is encrypted on your device before it leaves. We use advanced cryptographic techniques that make
              it mathematically impossible for anyone (including us) to see your raw data.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#3A6EFF]/10 rounded-lg mt-1">
            <Eye className="h-5 w-5 text-[#3A6EFF]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Computation happens without raw data leaving your device
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our Secure Multi-Party Computation (SMPC) protocols allow analysis to happen across multiple parties
              without anyone seeing the underlying data. Think of it as performing calculations on locked safes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#22D3A6]/10 rounded-lg mt-1">
            <Shield className="h-5 w-5 text-[#22D3A6]" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Built using Secure Multi-Party Computation (SMPC) protocols
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              SMPC is a proven cryptographic technique used by banks and governments. It's been researched for decades
              and is now mature enough for real-world applications like Outliers.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      {/* <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 transition-all duration-200">
          <FileText className="h-4 w-4" />
          Read Technical Whitepaper
          <ExternalLink className="h-3 w-3" />
        </button>

        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3A6EFF]/10 hover:bg-[#3A6EFF]/20 border border-[#3A6EFF]/30 rounded-lg text-[#3A6EFF] transition-all duration-200">
          <Shield className="h-4 w-4" />
          View Security Certifications
        </button>
      </div> */}
    </div>
  )
}
