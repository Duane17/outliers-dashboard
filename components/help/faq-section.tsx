"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "How do I upload a dataset?",
    answer:
      "Navigate to the Datasets page and click the 'Upload Dataset' button. You can drag and drop files or browse to select them. Supported formats include CSV, JSON, and Excel files up to 100MB. Your data is encrypted during upload and stored securely.",
  },
  {
    question: "Can I collaborate with someone outside my organization?",
    answer:
      "Yes! You can invite external collaborators by email. They'll receive an invitation link to join your workspace. External collaborators can participate in computations without accessing your raw data, thanks to our secure multi-party computation technology.",
  },
  {
    question: "What is Secure Multi-Party Computation (SMPC) and why does it matter?",
    answer:
      "SMPC allows multiple parties to jointly compute insights without revealing their private data to each other. Think of it as a way to collaborate on analysis while keeping your data completely private. Even we at Outliers cannot see your raw data during computations.",
  },
  {
    question: "Can you see my data?",
    answer:
      "No, we cannot see your raw data. All data is encrypted on your device before upload, and our SMPC protocols ensure that computations happen without exposing individual data points. We only see encrypted mathematical representations that cannot be reverse-engineered.",
  },
  {
    question: "How do I know my computations are secure?",
    answer:
      "Every computation is logged in our audit trail with cryptographic proofs. You can verify that no data leaked during the process. Our security measures are regularly audited by third-party security firms, and we're compliant with GDPR, HIPAA, and SOC 2 standards.",
  },
  {
    question: "What happens if I delete my account?",
    answer:
      "When you delete your account, all your data is permanently removed from our systems within 30 days. Any ongoing collaborations will be terminated, and your collaborators will be notified. You can export your data before deletion if needed.",
  },
  {
    question: "Can I integrate Outliers with my existing tools?",
    answer:
      "Yes! We provide REST APIs and SDKs for Python, R, and JavaScript. You can also use our webhooks to get notified about computation results. Check out our API documentation in the developer section for integration guides.",
  },
  {
    question: "How much does Outliers cost?",
    answer:
      "We offer a free tier with up to 3 datasets and 5 collaborations per month. Pro plans start at MWK 50,000/month for unlimited datasets and advanced features. Enterprise plans include custom security requirements and dedicated support.",
  },
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#3A6EFF]/10 rounded-lg">
          <HelpCircle className="h-6 w-6 text-[#3A6EFF]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Frequently Asked Questions</h2>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#22D3A6]/30"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between bg-slate-100 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900 pr-4">{item.question}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-slate-500 transition-transform duration-200 flex-shrink-0",
                  openItems.has(index) ? "rotate-180" : "",
                )}
              />
            </button>

            <div
              className={cn(
                "transition-all duration-200 ease-in-out overflow-hidden",
                openItems.has(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              <div className="px-4 py-3 text-sm text-slate-700 leading-relaxed bg-slate-50">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
