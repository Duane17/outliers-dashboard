"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { MARKETING_URL, AUTH_PATH } from "@/lib/config";

/**
 * Route guard hook for protected dashboard pages.
 *
 * Responsibilities:
 * - Read auth status from AuthProvider.
 * - If unauthenticated, redirect to marketing auth with a `next` query param.
 * - For error state, do not redirect so the error screen can show retry.
 * - Return the current status so pages can decide what to render in the meantime.
 */
export function useRequireAuth() {
  const { status } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      const base = MARKETING_URL.replace(/\/+$/, "");
      const authPath = AUTH_PATH.startsWith("/") ? AUTH_PATH : `/${AUTH_PATH}`;

      const currentPath = pathname || "/";
      const url = `${base}${authPath}?next=${encodeURIComponent(currentPath)}`;

      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    }

    // For status "loading" and "error" we do not redirect.
    // - "loading" is handled by the full screen loader in AuthProvider
    // - "error" is handled by the AuthErrorScreen with retry
  }, [status, pathname]);

  return status;
}
