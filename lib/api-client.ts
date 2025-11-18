// outliers-dashboard/lib/api-client.ts
import { http, HttpError } from "./http";

export { HttpError };

export interface MeUser {
  id: string;
  orgId: string;
  email: string;
  role: "OWNER" | "ADMIN" | "USER" | "AUDITOR";
  createdAt?: string;
  name?: string | null;
}

export interface MeResponse {
  user: MeUser;
}

/**
 * Call GET /v1/auth/me via the shared http helper.
 * This will throw HttpError with status 401 when the session is missing or invalid.
 */
export async function getCurrentUser(): Promise<MeUser> {
  const res = await http<MeResponse>("/auth/me", { method: "GET" });
  return res.user;
}
