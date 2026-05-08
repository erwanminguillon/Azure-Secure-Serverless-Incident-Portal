export const STATUS_CODES = [
  "submitted",
  "triage",
  "investigating",
  "resolved",
  "closed",
  "rejected",
] as const;

export const SEVERITY_CODES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const REPORT_TYPE_CODES = [
  "incident",
  "vulnerability",
  "suspicious_activity",
] as const;

export const CATEGORY_CODES = [
  "phishing",
  "malware",
  "account_compromise",
  "vulnerability",
  "suspicious_activity",
  "data_exposure",
  "policy_violation",
  "other",
] as const;

export type StatusCode = (typeof STATUS_CODES)[number];
export type SeverityCode = (typeof SEVERITY_CODES)[number];
export type ReportTypeCode = (typeof REPORT_TYPE_CODES)[number];
export type CategoryCode = (typeof CATEGORY_CODES)[number];

export interface ReferenceItem {
  code: string;
  displayName: string;
  sortOrder: number;
}

export interface StatusReferenceItem extends ReferenceItem {
  isTerminal: boolean;
}

export interface ReferenceDataResponse {
  statuses: StatusReferenceItem[];
  severities: ReferenceItem[];
  reportTypes: ReferenceItem[];
  categories: ReferenceItem[];
}