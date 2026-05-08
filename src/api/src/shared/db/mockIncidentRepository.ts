import type {
  AdminIncidentListResponse,
  CreateIncidentRequest,
  CreateIncidentResponse,
  Incident,
  IncidentQueryParams,
  TrackIncidentResponse,
  UpdateIncidentRequest,
  UpdateIncidentResponse,
} from "../models/Incident";

import type {
  AddIncidentCommentResponse,
  IncidentComment,
} from "../models/IncidentComment";

import type {
  AdminIncidentEvidenceListResponse,
  IncidentEvidence,
  UploadEvidenceResponse,
} from "../models/IncidentEvidence";

const mockIncidents: Incident[] = [
  {
    incidentId: "8c5c8d56-25d3-4d3b-9cc6-6bdc5cba9d82",
    publicId: "INC-2026-000001",
    trackingTokenHash: "mock-hash-token-1",
    title: "Suspicious login alert from unknown location",
    description: "I received a login alert for an account I did not access.",
    reportTypeCode: "incident",
    categoryCode: "account_compromise",
    severityCode: "medium",
    statusCode: "triage",
    submitterName: "Jane Doe",
    submitterEmail: "jane@example.com",
    isAnonymous: false,
    assignedReviewerId: "aad-object-id-here",
    assignedReviewerDisplayName: "Erwan Minguillon Le Page",
    submittedUtc: new Date().toISOString(),
    createdUtc: new Date().toISOString(),
    updatedUtc: new Date().toISOString(),
    lastStatusChangedUtc: new Date().toISOString(),
  },
];

const mockComments: IncidentComment[] = [];

const mockEvidence: IncidentEvidence[] = [];

// Only focus on the last six digit
function generatePublicId(sequence: number): string {
  return `INC-2026-${("000000" + sequence).slice(-6)}`;
}

export async function createIncident(
  input: CreateIncidentRequest
): Promise<CreateIncidentResponse> {
  const incidentId = crypto.randomUUID();
  const trackingToken = crypto.randomUUID().replace(/-/g, "");
  const publicId = generatePublicId(mockIncidents.length + 1);
  const now = new Date().toISOString();

  const newIncident: Incident = {
    incidentId,
    publicId,
    trackingTokenHash: `mock-hash-${trackingToken}`,
    title: input.title.trim(),
    description: input.description.trim(),
    reportTypeCode: input.reportTypeCode,
    categoryCode: input.categoryCode ?? null,
    severityCode: input.severityCode,
    statusCode: "submitted",
    submitterName: input.submitterName?.trim() ?? null,
    submitterEmail: input.submitterEmail?.trim() ?? null,
    isAnonymous: input.isAnonymous,
    assignedReviewerId: null,
    assignedReviewerDisplayName: null,
    submittedUtc: now,
    createdUtc: now,
    updatedUtc: now,
    lastStatusChangedUtc: now,
  };

  mockIncidents.push(newIncident);

  return {
    incidentId,
    publicId,
    trackingToken,
    submittedUtc: now,
    message:
      "Incident submitted successfully. Save your tracking token now; it will not be shown again.",
  };
}

export async function trackIncident(
  publicId: string,
  trackingToken: string
): Promise<TrackIncidentResponse | null> {
  const incident = mockIncidents.find((item) => item.publicId === publicId);

  if (!incident) {
    return null;
  }

  // Mock-only behavior:
  // accept any non-empty token for now.
  if (!trackingToken || trackingToken.trim().length === 0) {
    return null;
  }

  return {
    publicId: incident.publicId,
    statusCode: incident.statusCode,
    severityCode: incident.severityCode,
    categoryCode: incident.categoryCode,
    submittedUtc: incident.submittedUtc,
    lastUpdatedUtc: incident.updatedUtc,
  };
}

export async function listIncidents(
  query: IncidentQueryParams
): Promise<AdminIncidentListResponse> {
  let filtered = [...mockIncidents];

  if (query.statusCode) {
    filtered = filtered.filter((i) => i.statusCode === query.statusCode);
  }

  if (query.severityCode) {
    filtered = filtered.filter((i) => i.severityCode === query.severityCode);
  }

  if (query.categoryCode) {
    filtered = filtered.filter((i) => i.categoryCode === query.categoryCode);
  }

  if (query.reportTypeCode) {
    filtered = filtered.filter((i) => i.reportTypeCode === query.reportTypeCode);
  }

  if (query.search && query.search.trim().length > 0) {
    const search = query.search.trim().toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search) ||
        i.publicId.toLowerCase().includes(search)
    );
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const startIndex = (page - 1) * pageSize;
  const paged = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: paged.map((incident) => ({
      incidentId: incident.incidentId,
      publicId: incident.publicId,
      title: incident.title,
      reportTypeCode: incident.reportTypeCode,
      categoryCode: incident.categoryCode,
      severityCode: incident.severityCode,
      statusCode: incident.statusCode,
      submittedUtc: incident.submittedUtc,
      assignedReviewerDisplayName: incident.assignedReviewerDisplayName,
    })),
    page,
    pageSize,
    totalCount: filtered.length,
  };
}

export async function getIncidentById(
  incidentId: string
): Promise<Incident | null> {
  return mockIncidents.find((item) => item.incidentId === incidentId) ?? null;
}

export async function updateIncident(
  incidentId: string,
  input: UpdateIncidentRequest
): Promise<UpdateIncidentResponse | null> {
  const incident = mockIncidents.find((item) => item.incidentId === incidentId);

  if (!incident) {
    return null;
  }

  if (input.statusCode !== undefined) {
    incident.statusCode = input.statusCode;
    incident.lastStatusChangedUtc = new Date().toISOString();
  }

  if (input.severityCode !== undefined) {
    incident.severityCode = input.severityCode;
  }

  if (input.categoryCode !== undefined) {
    incident.categoryCode = input.categoryCode;
  }

  if (input.assignedReviewerId !== undefined) {
    incident.assignedReviewerId = input.assignedReviewerId;
  }

  if (input.assignedReviewerDisplayName !== undefined) {
    incident.assignedReviewerDisplayName = input.assignedReviewerDisplayName;
  }

  incident.updatedUtc = new Date().toISOString();

  return {
    incidentId: incident.incidentId,
    statusCode: incident.statusCode,
    severityCode: incident.severityCode,
    categoryCode: incident.categoryCode,
    assignedReviewerId: incident.assignedReviewerId,
    assignedReviewerDisplayName: incident.assignedReviewerDisplayName,
    updatedUtc: incident.updatedUtc,
  };
}

export async function addIncidentComment(
  incidentId: string,
  commentText: string
): Promise<AddIncidentCommentResponse | null> {
  const incident = mockIncidents.find((item) => item.incidentId === incidentId);

  if (!incident) {
    return null;
  }

  const now = new Date().toISOString();

  const comment: IncidentComment = {
    commentId: crypto.randomUUID(),
    incidentId,
    commentText,
    isInternal: true,
    createdById: "mock-admin-id",
    createdByDisplayName: "Mock Admin",
    createdUtc: now,
  };

  mockComments.push(comment);

  return {
    commentId: comment.commentId,
    incidentId: comment.incidentId,
    commentText: comment.commentText,
    isInternal: comment.isInternal,
    createdUtc: comment.createdUtc,
  };
}

export async function uploadEvidence(
  publicId: string
): Promise<UploadEvidenceResponse | null> {
  const incident = mockIncidents.find((item) => item.publicId === publicId);

  if (!incident) {
    return null;
  }

  const now = new Date().toISOString();

  const evidence: IncidentEvidence = {
    evidenceId: crypto.randomUUID(),
    incidentId: incident.incidentId,
    blobName: `mock/${crypto.randomUUID()}.png`,
    originalFileName: "placeholder-evidence.png",
    contentType: "image/png",
    fileSizeBytes: 0,
    sha256Hash: null,
    storageContainer: "evidence",
    uploadStatus: "uploaded",
    uploadedByRole: "public",
    uploadedUtc: now,
  };

  mockEvidence.push(evidence);

  return {
    evidenceId: evidence.evidenceId,
    publicId,
    originalFileName: evidence.originalFileName,
    contentType: evidence.contentType,
    fileSizeBytes: evidence.fileSizeBytes,
    uploadedUtc: evidence.uploadedUtc,
  };
}

export async function getEvidenceByIncidentId(
  incidentId: string
): Promise<AdminIncidentEvidenceListResponse> {
  return {
    items: mockEvidence.filter((item) => item.incidentId === incidentId),
  };
}