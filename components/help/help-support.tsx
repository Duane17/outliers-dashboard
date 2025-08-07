"use client"

import { useState } from "react"
import { TopNavigation } from "../layout/top-navigation"
import { SidebarNavigation } from "../layout/sidebar-navigation"
import { BreadcrumbNavigation } from "../layout/breadcrumb-navigation"
import { FAQSection } from "./faq-section"
import { ContactSupportForm } from "./contact-support-form"
import { FeedbackSubmission } from "./feedback-submission"
import { SecurityExplainer } from "./security-explainer"
import { DocumentationSection } from "./documentation-section"

export function HelpSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Topbar & Sidebar */}
      <TopNavigation onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <SidebarNavigation isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 bg-white">
        <div className="px-6 py-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumbs */}
            <BreadcrumbNavigation
              items={[
                { label: "Dashboard", href: "/" },
                { label: "Help & Support", href: "/help" },
              ]}
            />

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3A6EFF] to-[#22D3A6] bg-clip-text text-transparent mb-2">
                Help & Support
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Get the help you need to make the most of your Outliers experience. From quick answers to in-depth
                guidance, we're here to support your data collaboration journey.
              </p>
            </div>

            <div className="space-y-8">
              {/* Featured Section */}
              <SecurityExplainer />

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <FAQSection />
                  <FeedbackSubmission />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <ContactSupportForm />
                  {/* <DocumentationSection /> */}
                </div>
              </div>

              {/* CTA Footer */}
              <div className="bg-slate-100 rounded-xl border border-slate-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Still need help?</h3>
                <p className="text-slate-600 mb-4">
                  Can't find what you're looking for? Our support team is available 24/7 to assist you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="px-4 py-2 bg-[#3A6EFF] hover:bg-[#3A6EFF]/90 text-white rounded-lg font-medium transition-colors">
                    Schedule a Call
                  </button>
                  <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg font-medium transition-all duration-200">
                    Join Our Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
