import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type { ReferenceDataResponse } from "../shared/models/ReferenceData";
import { createApiError } from "../shared/models/ApiErrors";

import { getCorrelationId } from "../shared/utils/correlation";
import { isAuthenticatedAdmin } from "../shared/utils/adminAuth";
import { getReferenceData as getReferenceDataFromRepo } from "../shared/db/mockReferenceDataRepository";


export async function getReferenceData(
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

    const response = await getReferenceDataFromRepo();

    return {
    status: 200,
    jsonBody: response,
    headers: {
        "x-correlation-id": correlationId,
    },
    };
  } catch (error) {
    context.error("GetReferenceData failed", error);

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

app.http("GetReferenceData", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "internal/reference-data",
  handler: getReferenceData,
});
