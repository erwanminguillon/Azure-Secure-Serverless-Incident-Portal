import { HttpRequest } from "@azure/functions";

export function getCorrelationId(request: HttpRequest): string {
  return request.headers.get("x-correlation-id") ?? crypto.randomUUID();
}