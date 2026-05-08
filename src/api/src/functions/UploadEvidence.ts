import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import type { UploadEvidenceResponse } from "../shared/models/IncidentEvidence";
import { createApiError } from "../shared/models/ApiErrors";

function getCorrelationId(request: HttpRequest): string {
  return request.headers.get("x-correlation-id") ?? crypto.randomUUID();
}

export async function uploadEvidence(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const correlationId = getCorrelationId(request);

  try {
    const publicId = request.params.publicId;
    if (!publicId) {
      return {
        status: 400,
        jsonBody: createApiError(
          "VALIDATION_ERROR",
          "publicId is required.",
          correlationId,
          [{ field: "publicId", message: "publicId is required." }]
        ),
      };
    }

    // TODO:
    // - Decide whether MVP uses multipart/form-data or metadata-first approach
    // - Validate file type/size
    // - Upload to Blob Storage private container
    // - Save evidence metadata in SQL
    // - Create audit entry (evidence_uploaded)

    const response: UploadEvidenceResponse = {
      evidenceId: crypto.randomUUID(),
      publicId,
      originalFileName: "placeholder-evidence.png",
      contentType: "image/png",
      fileSizeBytes: 0,
      uploadedUtc: new Date().toISOString(),
    };

    return {
      status: 201,
      jsonBody: response,
      headers: {
        "x-correlation-id": correlationId,
      },
    };
  } catch (error) {
    context.error("UploadEvidence failed", error);

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

app.http("UploadEvidence", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "public/incidents/{publicId}/evidence",
  handler: uploadEvidence,
});
