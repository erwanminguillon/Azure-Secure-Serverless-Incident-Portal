import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type {
  AdminIncidentListResponse,
  IncidentQueryParams,
} from "../shared/models/Incident";
import { createApiError } from "../shared/models/ApiErrors";

import { getCorrelationId } from "../shared/utils/correlation";
import { isAuthenticatedAdmin } from "../shared/utils/adminAuth";

export async function listIncidents(
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

    const query: IncidentQueryParams = {
      statusCode: request.query.get("statusCode") as IncidentQueryParams["statusCode"] ?? undefined,
      severityCode: request.query.get("severityCode") as IncidentQueryParams["severityCode"] ?? undefined,
      categoryCode: request.query.get("categoryCode") as IncidentQueryParams["categoryCode"] ?? undefined,
      reportTypeCode: request.query.get("reportTypeCode") as IncidentQueryParams["reportTypeCode"] ?? undefined,
      search: request.query.get("search") ?? undefined,
      page: request.query.get("page") ? Number(request.query.get("page")) : 1,
      pageSize: request.query.get("pageSize")
        ? Number(request.query.get("pageSize"))
        : 20,
    };

    context.log("ListIncidents query", query);

    // TODO:
    // - Validate query params
    // - Query SQL with paging/filtering
    // - Return total count + items

    const response: AdminIncidentListResponse = {
      items: [],
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      totalCount: 0,
    };

    return {
      status: 200,
      jsonBody: response,
      headers: {
        "x-correlation-id": correlationId,
      },
    };
  } catch (error) {
    context.error("ListIncidents failed", error);

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

app.http("ListIncidents", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "internal/incidents",
  handler: listIncidents,
});