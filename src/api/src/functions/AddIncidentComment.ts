import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type {
  AddIncidentCommentRequest,
  AddIncidentCommentResponse,
} from "../shared/models/IncidentComment";
import { createApiError } from "../shared/models/ApiErrors";

import { getCorrelationId } from "../shared/utils/correlation";
import { isAuthenticatedAdmin } from "../shared/utils/adminAuth";

export async function addIncidentComment(
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

    const body = (await request.json()) as Partial<AddIncidentCommentRequest>;

    if (!body.commentText || body.commentText.trim().length === 0) {
      return {
        status: 400,
        jsonBody: createApiError(
          "VALIDATION_ERROR",
          "commentText is required.",
          correlationId,
          [{ field: "commentText", message: "commentText is required." }]
        ),
      };
    }

    // TODO:
    // Insert comment into SQL
    // Create audit entry (comment_added)
    // Attach admin identity from claims

    const response: AddIncidentCommentResponse = {
      commentId: crypto.randomUUID(),
      incidentId,
      commentText: body.commentText.trim(),
      isInternal: true,
      createdUtc: new Date().toISOString(),
    };

    return {
      status: 201,
      jsonBody: response,
      headers: {
        "x-correlation-id": correlationId,
      },
    };
  } catch (error) {
    context.error("AddIncidentComment failed", error);

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

app.http("AddIncidentComment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "admin/incidents/{incidentId}/comments",
  handler: addIncidentComment,
});
