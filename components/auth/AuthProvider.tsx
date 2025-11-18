// outliers-dashboard/components/auth/AuthProvider.tsx
"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCurrentUser, logoutUser, type MeUser, HttpError } from "@/lib/api-client";
import { getMarketingAuthUrl } from "@/lib/config";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: MeUser | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider resolves the current user using GET /v1/auth/me
 * and exposes auth state to the dashboard through a React context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<MeUser | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
      setStatus("authenticated");
    } catch (err) {
      if (err instanceof HttpError && err.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
      } else {
        console.error("Failed to resolve current user", err);
        setUser(null);
        setStatus("unauthenticated");
      }
    }
  }, []);

  useEffect(() => {
    // On first mount, resolve the current session
    loadUser();
  }, [loadUser]);

  const refresh = async () => {
    setStatus("loading");
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume auth state inside the dashboard.
 * Example:
 *   const { status, user, refresh, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
