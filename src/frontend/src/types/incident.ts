import type {
  CategoryCode,
  ReportTypeCode,
  SeverityCode,
  StatusCode,
} from "./reference-data";

export interface CreateIncidentRequest {
  title: string;
  description: string;
  reportTypeCode: ReportTypeCode;
  categoryCode?: CategoryCode;
  severityCode: SeverityCode;
  submitterName?: string;
  submitterEmail?: string;
  isAnonymous: boolean;
}

export interface CreateIncidentResponse {
  incidentId: string;
  publicId: string;
  trackingToken: string;
  submittedUtc: string;
  message: string;
}

export interface TrackIncidentRequest {
  publicId: string;
  trackingToken: string;
}

export interface TrackIncidentResponse {
  publicId: string;
  statusCode: StatusCode;
  severityCode: SeverityCode;
  categoryCode: CategoryCode | null;
  submittedUtc: string;
  lastUpdatedUtc: string;
}

export interface AdminIncidentListItem {
  incidentId: string;
  publicId: string;
  title: string;
  reportTypeCode: ReportTypeCode;
  categoryCode: CategoryCode | null;
  severityCode: SeverityCode;
  statusCode: StatusCode;
  submittedUtc: string;
  assignedReviewerDisplayName: string | null;
}

export interface AdminIncidentListResponse {
  items: AdminIncidentListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface IncidentDetail {
  incidentId: string;
  publicId: string;
  title: string;
  description: string;
  reportTypeCode: ReportTypeCode;
  categoryCode: CategoryCode | null;
  severityCode: SeverityCode;
  statusCode: StatusCode;
  submitterName: string | null;
  submitterEmail: string | null;
  isAnonymous: boolean;
  assignedReviewerId: string | null;
  assignedReviewerDisplayName: string | null;
  submittedUtc: string;
  updatedUtc: string;
  lastStatusChangedUtc: string;
}

export interface UpdateIncidentRequest {
  statusCode?: StatusCode;
  severityCode?: SeverityCode;
  categoryCode?: CategoryCode;
  assignedReviewerId?: string | null;
  assignedReviewerDisplayName?: string | null;
}

export interface UpdateIncidentResponse {
  incidentId: string;
  statusCode: StatusCode;
  severityCode: SeverityCode;
  categoryCode: CategoryCode | null;
  assignedReviewerId: string | null;
  assignedReviewerDisplayName: string | null;
  updatedUtc: string;
}

export interface IncidentEvidence {
  evidenceId: string;
  incidentId: string;
  blobName: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  sha256Hash: string | null;
  storageContainer: string;
  uploadStatus: "uploaded" | "rejected" | "quarantined" | "deleted";
  uploadedByRole: "public" | "admin";
  uploadedUtc: string;
}

export interface AddIncidentCommentRequest {
  commentText: string;
}

export interface IncidentComment {
  commentId: string;
  incidentId: string;
  commentText: string;
  isInternal: boolean;
  createdById: string | null;
  createdByDisplayName: string | null;
  createdUtc: string;
}