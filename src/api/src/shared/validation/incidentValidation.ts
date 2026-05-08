import type {
  CreateIncidentRequest,
  TrackIncidentRequest,
  UpdateIncidentRequest,
} from "../models/Incident";

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
}

export function validateCreateIncidentRequest(
  body: Partial<CreateIncidentRequest>
): ValidationResult {
  const errors: ValidationIssue[] = [];

  if (!body.title || body.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required." });
  }

  if (!body.description || body.description.trim().length === 0) {
    errors.push({ field: "description", message: "Description is required." });
  }

  if (!body.reportTypeCode) {
    errors.push({
      field: "reportTypeCode",
      message: "Report type is required.",
    });
  }

  if (!body.severityCode) {
    errors.push({
      field: "severityCode",
      message: "Severity is required.",
    });
  }

  if (typeof body.isAnonymous !== "boolean") {
    errors.push({
      field: "isAnonymous",
      message: "isAnonymous must be a boolean.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateTrackIncidentRequest(
  body: Partial<TrackIncidentRequest>
): ValidationResult {
  const errors: ValidationIssue[] = [];

  if (!body.publicId || body.publicId.trim().length === 0) {
    errors.push({
      field: "publicId",
      message: "PublicId is required.",
    });
  }

  if (!body.trackingToken || body.trackingToken.trim().length === 0) {
    errors.push({
      field: "trackingToken",
      message: "Tracking token is required.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUpdateIncidentRequest(
  body: Partial<UpdateIncidentRequest>
): ValidationResult {
  const errors: ValidationIssue[] = [];

  const hasAnySupportedField =
    body.statusCode !== undefined ||
    body.severityCode !== undefined ||
    body.categoryCode !== undefined ||
    body.assignedReviewerId !== undefined ||
    body.assignedReviewerDisplayName !== undefined;

  if (!hasAnySupportedField) {
    errors.push({
      field: "body",
      message: "At least one updatable field must be provided.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}