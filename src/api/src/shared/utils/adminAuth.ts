import { HttpRequest } from "@azure/functions";

/**
 * Temporary development-only admin check.
 *
 * Later this will be replaced with actual authentication/claims validation
 * using Azure Static Web Apps + Microsoft Entra identity context.
 */
export function isAuthenticatedAdmin(request: HttpRequest): boolean {
  return request.headers.get("x-dev-admin") === "true";
}