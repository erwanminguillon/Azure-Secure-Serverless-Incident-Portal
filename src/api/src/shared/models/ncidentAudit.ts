export type IncidentAuditActionType =
  | "incident_created"
  | "status_changed"
  | "severity_changed"
  | "category_changed"
  | "assignment_changed"
  | "comment_added"
  | "evidence_uploaded"
  | "tracking_checked";

export type AuditPerformedByType = "public" | "admin" | "system";

export interface IncidentAudit {
  auditId: string;
  incidentId: string;
  actionType: IncidentAuditActionType;
  oldValueJson: string | null;
  newValueJson: string | null;
  performedByType: AuditPerformedByType;
  performedById: string | null;
  performedByDisplayName: string | null;
  correlationId: string | null;
  performedUtc: string;
}