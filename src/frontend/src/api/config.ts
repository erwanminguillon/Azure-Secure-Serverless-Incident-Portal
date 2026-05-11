const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  console.warn("VITE_API_BASE_URL is not set.");
}

export const API_BASE_URL = (rawApiBaseUrl ?? "").replace(/\/$/, "");

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}