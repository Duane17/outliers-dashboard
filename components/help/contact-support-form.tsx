"use client"

import { useState } from "react"
import { Mail, Paperclip, Send, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ContactSupportForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAttachment, setShowAttachment] = useState(false)

  /* ----------------------------------------------------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(res => setTimeout(res, 1500)) // fake API call
    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  /* ----------------------- success message ------------------------ */
  if (isSubmitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Check className="h-6 w-6 text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Message Sent!</h2>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <p className="text-slate-700 mb-2">
            We've received your request and will get back to you soon.
          </p>
          <p className="text-sm text-slate-500">
            Typical response time is within 2-4 hours during business days.
          </p>
        </div>
      </div>
    )
  }

  /* ----------------------------- form ----------------------------- */
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#3A6EFF]/10 rounded-lg">
          <Mail className="h-6 w-6 text-[#3A6EFF]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Contact Support</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3A6EFF] transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3A6EFF] transition"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3A6EFF] transition"
          >
            <option value="">Select a topic</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="security">Security Concern</option>
            <option value="feature">Feature Request</option>
            <option value="collaboration">Collaboration Help</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3A6EFF] transition resize-vertical"
            placeholder="Describe your issue or question in detail..."
          />
        </div>

        {/* Attachment toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAttachment(!showAttachment)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 transition"
          >
            <Paperclip className="h-4 w-4" />
            Attach file / screenshot
          </button>
        </div>

        {/* Attachment dropzone */}
        {showAttachment && (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Max size: 10 MB · PNG, JPG, PDF, TXT
            </p>
            <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.txt" />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium",
            "bg-[#22D3A6] hover:bg-emerald-500/90 text-white",
            "focus:outline-none focus:ring-2 focus:ring-[#22D3A6] focus:ring-offset-2 focus:ring-offset-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  )
}
