import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type {
  TrackIncidentRequest,
  TrackIncidentResponse,
} from "../shared/models/Incident";
import { createApiError } from "../shared/models/ApiErrors";
import { getCorrelationId } from "../shared/utils/correlation";
import { trackIncident as trackIncidentFromRepo } from "../shared/db/mockIncidentRepository";

export async function trackIncident(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const correlationId = getCorrelationId(request);

  try {
    const body = (await request.json()) as Partial<TrackIncidentRequest>;

    if (!body.publicId || !body.trackingToken) {
      return {
        status: 400,
        jsonBody: createApiError(
          "VALIDATION_ERROR",
          "Both publicId and trackingToken are required.",
          correlationId,
          [
            !body.publicId
              ? { field: "publicId", message: "PublicId is required." }
              : undefined,
            !body.trackingToken
              ? { field: "trackingToken", message: "Tracking token is required." }
              : undefined,
          ].filter(Boolean) as { field: string; message: string }[],
        ),
      };
    }

    // TODO:
    // - Look up incident by PublicId
    // - Hash supplied tracking token
    // - Compare with TrackingTokenHash
    // - Return only limited-safe data

    const result = await trackIncidentFromRepo(body.publicId, body.trackingToken);

    if (!result) {
    return {
        status: 401,
        jsonBody: createApiError(
        "TRACKING_TOKEN_INVALID",
        "The incident reference or tracking token is invalid.",
        correlationId
        ),
    };
    }

    return {
    status: 200,
    jsonBody: result,
    headers: {
        "x-correlation-id": correlationId,
    },
    };
  } catch (error) {
    context.error("TrackIncident failed", error);

    return {
      status: 500,
      jsonBody: createApiError(
        "INTERNAL_ERROR",
        "An unexpected error occurred.",
        correlationId
      ),
    };
  }
}

app.http("TrackIncident", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "public/incidents/track",
  handler: trackIncident,
});