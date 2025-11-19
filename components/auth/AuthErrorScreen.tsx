"use client";

import type React from "react";
import { AlertTriangle } from "lucide-react";

interface AuthErrorScreenProps {
  message: string;
  onRetry: () => void;
}

/**
 * Full screen error state shown when the dashboard cannot verify the session
 * due to network issues or server errors.
 *
 * It avoids redirecting to the marketing auth page so we do not create loops
 * when the API is temporarily down.
 */
export function AuthErrorScreen({ message, onRetry }: AuthErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
      <div className="max-w-sm w-full px-6 py-8 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50">
          <AlertTriangle className="h-5 w-5 text-[#3A6EFF]" />
        </div>

        <h1 className="text-base font-semibold text-slate-900">
          We cannot verify your session
        </h1>

        <p className="text-sm text-slate-500 font-inter">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-[#3A6EFF] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3258d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3A6EFF]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
