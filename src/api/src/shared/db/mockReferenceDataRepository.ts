import type { ReferenceDataResponse } from "../models/ReferenceData";

export async function getReferenceData(): Promise<ReferenceDataResponse> {
  return {
    statuses: [
      { code: "submitted", displayName: "Submitted", sortOrder: 1, isTerminal: false },
      { code: "triage", displayName: "Triage", sortOrder: 2, isTerminal: false },
      { code: "investigating", displayName: "Investigating", sortOrder: 3, isTerminal: false },
      { code: "resolved", displayName: "Resolved", sortOrder: 4, isTerminal: false },
      { code: "closed", displayName: "Closed", sortOrder: 5, isTerminal: true },
      { code: "rejected", displayName: "Rejected", sortOrder: 6, isTerminal: true },
    ],
    severities: [
      { code: "low", displayName: "Low", sortOrder: 1 },
      { code: "medium", displayName: "Medium", sortOrder: 2 },
      { code: "high", displayName: "High", sortOrder: 3 },
      { code: "critical", displayName: "Critical", sortOrder: 4 },
    ],
    reportTypes: [
      { code: "incident", displayName: "Incident", sortOrder: 1 },
      { code: "vulnerability", displayName: "Vulnerability", sortOrder: 2 },
      { code: "suspicious_activity", displayName: "Suspicious Activity", sortOrder: 3 },
    ],
    categories: [
      { code: "phishing", displayName: "Phishing", sortOrder: 1 },
      { code: "malware", displayName: "Malware", sortOrder: 2 },
      { code: "account_compromise", displayName: "Account Compromise", sortOrder: 3 },
      { code: "vulnerability", displayName: "Vulnerability", sortOrder: 4 },
      { code: "suspicious_activity", displayName: "Suspicious Activity", sortOrder: 5 },
      { code: "data_exposure", displayName: "Data Exposure", sortOrder: 6 },
      { code: "policy_violation", displayName: "Policy Violation", sortOrder: 7 },
      { code: "other", displayName: "Other", sortOrder: 8 },
    ],
  };
}