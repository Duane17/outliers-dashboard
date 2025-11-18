"use client";

import type { ReactNode } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";

/**
 * Wraps the entire dashboard and enforces authentication.
 *
 * Responsibilities:
 * - Call useRequireAuth, which will redirect to marketing /auth when
 *   status becomes "unauthenticated".
 * - While not authenticated, do not render any dashboard chrome.
 */
export function ProtectedShell({ children }: { children: ReactNode }) {
  const status = useRequireAuth();

  // While status is "loading" or "unauthenticated", do not show dashboard content.
  // - "loading": AuthProvider is still resolving /v1/auth/me
  // - "unauthenticated": useRequireAuth has already triggered a redirect
  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
