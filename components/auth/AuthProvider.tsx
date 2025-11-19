"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getCurrentUser,
  logoutUser,
  type MeUser,
  HttpError,
} from "@/lib/api-client";
import { getMarketingAuthUrl } from "@/lib/config";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextValue {
  status: AuthStatus;
  user: MeUser | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  errorMessage: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider resolves the current user using GET /v1/auth/me
 * and exposes auth state to the dashboard through a React context.
 *
 * States:
 * - loading: initial resolution or manual refresh in progress
 * - authenticated: valid session and user object present
 * - unauthenticated: clean 401 from backend, safe to redirect to marketing auth
 * - error: network failure or 5xx from backend, user sees retry UI instead of redirect
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<MeUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    // Reset any previous error before trying again
    setErrorMessage(null);

    try {
      const u = await getCurrentUser();
      setUser(u);
      setStatus("authenticated");
    } catch (err) {
      if (err instanceof HttpError) {
        // Clean unauthenticated case - safe to treat as logged out
        if (err.status === 401) {
          setUser(null);
          setStatus("unauthenticated");
          return;
        }

        // Server side failure - keep user on dashboard shell with retry
        if (err.status >= 500 && err.status <= 599) {
          console.error("Auth resolution failed with server error", err);
          setUser(null);
          setStatus("error");
          setErrorMessage(
            err.message || "The server is currently unavailable. Please try again shortly.",
          );
          return;
        }
      }

      // Network problem or unexpected error
      console.error("Auth resolution failed due to network or unexpected error", err);
      setUser(null);
      setStatus("error");
      setErrorMessage(
        "We could not verify your session because the server could not be reached. Please check your connection and try again.",
      );
    }
  }, []);

  useEffect(() => {
    // On first mount, resolve the current session
    loadUser();
  }, [loadUser]);

  const refresh = async () => {
    setStatus("loading");
    setErrorMessage(null);
    await loadUser();
  };

  const logout = async () => {
    try {
      // Tell backend to clear the httpOnly cookie
      await logoutUser();
    } catch (err) {
      // Log but still clear local state, since cookie may already be gone
      console.error("Failed to logout on server", err);
    } finally {
      // Clear local auth state
      setUser(null);
      setStatus("unauthenticated");
      setErrorMessage(null);

      // Redirect to marketing auth page without next
      const target = getMarketingAuthUrl();
      if (typeof window !== "undefined") {
        window.location.href = target;
      }
    }
  };

  const value: AuthContextValue = {
    status,
    user,
    refresh,
    logout,
    errorMessage,
  };

  // While loading, block dashboard chrome and show a full screen loader
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-neural-blue">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-[#3A6EFF] animate-spin" />
          <p className="text-sm text-[#3A6EFF] font-inter">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  // When auth resolution fails due to network or server error, show an inline
  // error screen with a retry button instead of redirecting to marketing.
  if (status === "error") {
    return (
      <AuthErrorScreen
        message={
          errorMessage ??
          "We could not reach the authentication service. Please try again in a moment."
        }
        onRetry={refresh}
      />
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth state inside the dashboard.
 * Example:
 *   const { status, user, refresh, logout, errorMessage } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/**
 * Local inline import of the error screen to keep this file self contained.
 * If you place AuthErrorScreen in a separate file, adjust the import at top:
 *   import { AuthErrorScreen } from "@/components/auth/AuthErrorScreen";
 */
import { AuthErrorScreen } from "./AuthErrorScreen";
