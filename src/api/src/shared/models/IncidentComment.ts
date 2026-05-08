export interface IncidentComment {
  commentId: string;
  incidentId: string;
  commentText: string;
  isInternal: boolean;
  createdById: string | null;
  createdByDisplayName: string | null;
  createdUtc: string;
}

export interface AddIncidentCommentRequest {
  commentText: string;
}

export interface AddIncidentCommentResponse {
  commentId: string;
  incidentId: string;
  commentText: string;
  isInternal: boolean;
  createdUtc: string;
}