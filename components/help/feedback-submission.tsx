"use client"

import { useState } from "react"
import {
  MessageSquare,
  Send,
  Check,
  Frown,
  Meh,
  Smile,
  Laugh,
  ThumbsUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconOptions = [
  { Icon: Frown, label: "Very Poor", value: 1 },
  { Icon: Meh, label: "Poor", value: 2 },
  { Icon: Smile, label: "Okay", value: 3 },
  { Icon: Laugh, label: "Good", value: 4 },
  { Icon: ThumbsUp, label: "Excellent", value: 5 },
]

export function FeedbackSubmission() {
  const [rating, setRating] = useState<number | null>(null)
  const [iconRating, setIconRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(res => setTimeout(res, 1000)) // mock API
    setIsSubmitting(false)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setRating(null)
      setIconRating(null)
      setFeedback("")
    }, 3000)
  }

  /* ---------- success state ---------- */
  if (isSubmitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Thank you for your feedback!
          </h3>
          <p className="text-sm text-slate-600">
            Your input helps us improve the Outliers experience.
          </p>
        </div>
      </div>
    )
  }

  /* ---------- form ---------- */
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#3A6EFF]/10 rounded-lg">
          <MessageSquare className="h-6 w-6 text-[#3A6EFF]" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Share Your Feedback
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Icon rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            How was your experience?
          </label>
          <div className="flex gap-3">
            {iconOptions.map(({ Icon, label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setIconRating(value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg transition-all",
                  "border border-slate-300 hover:border-emerald-400",
                  iconRating === value
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                    : "hover:bg-slate-100 text-slate-500",
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label
            htmlFor="feedback-message"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Tell us more (optional)
          </label>
          <textarea
            id="feedback-message"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3A6EFF] focus:border-transparent transition-all resize-vertical"
            placeholder="What did you like? What could we improve?"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || (!rating && !iconRating)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
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
          {isSubmitting ? "Sending…" : "Send Feedback"}
        </button>
      </form>
    </div>
  )
}
