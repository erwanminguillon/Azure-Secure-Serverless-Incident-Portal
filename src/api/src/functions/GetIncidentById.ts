import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import { createApiError } from "../shared/models/ApiErrors";
import type { Incident } from "../shared/models/Incident";

import { getCorrelationId } from "../shared/utils/correlation";
import { isAuthenticatedAdmin } from "../shared/utils/adminAuth";

export async function getIncidentById(
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

    // TODO:
    // - Query incident by IncidentId from SQL
    // - Return 404 if not found

    const mockIncident: Incident = {
      incidentId,
      publicId: "INC-2026-000001",
      trackingTokenHash: "hashed-token-placeholder",
      title: "Suspicious login alert from unknown location",
      description: "I received a login alert for an account I did not access.",
      reportTypeCode: "incident",
      categoryCode: "account_compromise",
      severityCode: "medium",
      statusCode: "triage",
      submitterName: "Jane Doe",
      submitterEmail: "jane@example.com",
      isAnonymous: false,
      assignedReviewerId: "aad-object-id-here",
      assignedReviewerDisplayName: "Erwan Minguillon Le Page",
      submittedUtc: new Date().toISOString(),
      createdUtc: new Date().toISOString(),
      updatedUtc: new Date().toISOString(),
      lastStatusChangedUtc: new Date().toISOString(),
    };

    return {
      status: 200,
      jsonBody: mockIncident,
      headers: {
        "x-correlation-id": correlationId,
      },
    };
  } catch (error) {
    context.error("GetIncidentById failed", error);

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

app.http("GetIncidentById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "internal/incidents/{incidentId}",
  handler: getIncidentById,
});