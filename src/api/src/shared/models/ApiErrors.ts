export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TRACKING_TOKEN_INVALID"
  | "CONFLICT"
  | "UNSUPPORTED_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "INTERNAL_ERROR";

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details: ApiErrorDetail[];
    correlationId: string;
  };
}

export function createApiError(
  code: ApiErrorCode,
  message: string,
  correlationId: string,
  details: ApiErrorDetail[] = []
): ApiErrorBody {
  return {
    error: {
      code,
      message,
      details,
      correlationId,
    },
  };
}