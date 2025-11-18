"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getCurrentUser, type MeUser, HttpError } from "@/lib/api-client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: MeUser | null;
  refresh: () => Promise<void>;
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
    // On first mount, resolve the current session.
    loadUser();
  }, [loadUser]);

  const value: AuthContextValue = {
    status,
    user,
    refresh: async () => {
      setStatus("loading");
      await loadUser();
    },
  };

  // While loading, we block rendering of the dashboard chrome
  // and show a simple full screen loader instead.
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-neural-blue animate-spin" />
          <p className="text-sm text-slate-400 font-inter">
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
 *   const { status, user, refresh } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
