import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type {
  UpdateIncidentRequest,
  UpdateIncidentResponse,
} from "../shared/models/Incident";
import { createApiError } from "../shared/models/ApiErrors";

import { getCorrelationId } from "../shared/utils/correlation";
import { isAuthenticatedAdmin } from "../shared/utils/adminAuth";

export async function updateIncident(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const correlationId = getCorrelationId(request);

  try {
    if (!isAuthenticatedAdmin(request)) {
      return {
        status: 401,
        jsonBody: createApiError(
          "UNAUTHORIZED",
          "Authentication is required.",
          correlationId
        ),
      };
    }

    const incidentId = request.params.incidentId;
    if (!incidentId) {
      return {
        status: 400,
        jsonBody: createApiError(
          "VALIDATION_ERROR",
          "incidentId is required.",
          correlationId,
          [{ field: "incidentId", message: "incidentId is required." }]
        ),
      };
    }

    const body = (await request.json()) as UpdateIncidentRequest;

    // TODO:
    // - Validate allowed fields
    // - Validate enum values
    // - Validate status transitions
    // - Update SQL record
    // - Create audit entries for changed fields

    const response: UpdateIncidentResponse = {
      incidentId,
      statusCode: body.statusCode ?? "triage",
      severityCode: body.severityCode ?? "medium",
      categoryCode: body.categoryCode ?? null,
      assignedReviewerId: body.assignedReviewerId ?? null,
      assignedReviewerDisplayName: body.assignedReviewerDisplayName ?? null,
      updatedUtc: new Date().toISOString(),
    };

    return {
      status: 200,
      jsonBody: response,
      headers: {
        "x-correlation-id": correlationId,
      },
    };
  } catch (error) {
    context.error("UpdateIncident failed", error);

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

app.http("UpdateIncident", {
  methods: ["PATCH"],
  authLevel: "anonymous",
  route: "internal/incidents/{incidentId}",
  handler: updateIncident,
});