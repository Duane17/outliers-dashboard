// outliers-dashboard/lib/config.ts

/**
 * Strip trailing slashes from a URL so we can safely join paths.
 */
function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Normalise a path to always have exactly one leading slash.
 */
function normalisePath(path: string): string {
  if (!path) return "/";
  return `/${path.replace(/^\/+/, "")}`;
}

/**
 * Raw env values as seen at build time in the dashboard app.
 */
const rawApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
const rawMarketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL;
const rawAuthPath = process.env.NEXT_PUBLIC_AUTH_PATH;

/**
 * Backend API base used by the dashboard.
 */
export const API_BASE_URL =
  rawApiBase && rawApiBase.length > 0
    ? stripTrailingSlashes(rawApiBase)
    : "http://localhost:4000/v1";

/**
 * Marketing site base, used when redirecting unauthenticated users.
 */
export const MARKETING_URL =
  rawMarketingUrl && rawMarketingUrl.length > 0
    ? stripTrailingSlashes(rawMarketingUrl)
    : "http://localhost:3000";

/**
 * Path to the auth page on the marketing site.
 */
export const AUTH_PATH =
  rawAuthPath && rawAuthPath.length > 0 ? normalisePath(rawAuthPath) : "/auth";

/**
 * Helper that builds the full auth URL on the marketing site.
 * For example: http://localhost:3000/auth?next=%2Finsights
 */
export function getMarketingAuthUrl(nextPath?: string | null): string {
  const base = `${MARKETING_URL}${AUTH_PATH}`;

  if (!nextPath) return base;

  // Only allow relative paths starting with a slash
  if (!nextPath.startsWith("/")) {
    return base;
  }

  const encoded = encodeURIComponent(nextPath);
  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}next=${encoded}`;
}
