// outliers-dashboard/lib/http.ts
import { API_BASE_URL } from "./config";

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic HTTP helper for the dashboard.
 * Always sends credentials so the backend session cookie is present.
 */
export async function http<TResponse = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const cleanedPath = path.replace(/^\/+/, "");
  const url = `${base}/${cleanedPath}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  const raw = await res.text();
  let data: unknown = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const anyData = data as any;
    const message =
      anyData?.error?.message ||
      anyData?.message ||
      `Request failed with status ${res.status}`;

    throw new HttpError(message, res.status, data);
  }

  return data as TResponse;
}
