import { buildApiUrl } from "./config";
import type {
  CreateIncidentRequest,
  CreateIncidentResponse,
  TrackIncidentRequest,
  TrackIncidentResponse,
} from "../types/incident";
import type { ApiErrorResponse } from "../types/api";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const errorBody = (await response.json()) as ApiErrorResponse;
      throw errorBody;
    }

    throw new Error(`HTTP ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("Expected JSON response.");
  }

  return (await response.json()) as T;
}

export async function submitIncident(
  payload: CreateIncidentRequest
): Promise<CreateIncidentResponse> {
  const response = await fetch(buildApiUrl("/public/incidents"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<CreateIncidentResponse>(response);
}

export async function trackIncident(
  payload: TrackIncidentRequest
): Promise<TrackIncidentResponse> {
  const response = await fetch(buildApiUrl("/public/incidents/track"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<TrackIncidentResponse>(response);
}