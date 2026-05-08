export type EvidenceUploadStatus =
  | "uploaded"
  | "rejected"
  | "quarantined"
  | "deleted";

export type EvidenceUploadedByRole = "public" | "admin";

export interface IncidentEvidence {
  evidenceId: string;
  incidentId: string;
  blobName: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  sha256Hash: string | null;
  storageContainer: string;
  uploadStatus: EvidenceUploadStatus;
  uploadedByRole: EvidenceUploadedByRole;
  uploadedUtc: string;
}

export interface UploadEvidenceResponse {
  evidenceId: string;
  publicId: string;
  originalFileName: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedUtc: string;
}

export interface AdminIncidentEvidenceListResponse {
  items: IncidentEvidence[];
}