# Database Schema

## Overview

The Secure Serverless Incident Portal uses a relational data model to support:

- public incident submission
- secure status tracking
- admin triage and updates
- evidence attachment metadata
- audit history
- internal comments

## Core tables

### `Incidents`
Main table for incident reports.

#### Columns
- `IncidentId` (UNIQUEIDENTIFIER, PK)
- `PublicId` (NVARCHAR(30), UNIQUE)
- `TrackingTokenHash` (NVARCHAR(255))
- `Title` (NVARCHAR(200))
- `Description` (NVARCHAR(MAX))
- `ReportTypeCode` (NVARCHAR(50))
- `CategoryCode` (NVARCHAR(50), nullable)
- `SeverityCode` (NVARCHAR(20))
- `StatusCode` (NVARCHAR(30))
- `SubmitterName` (NVARCHAR(150), nullable)
- `SubmitterEmail` (NVARCHAR(256), nullable)
- `IsAnonymous` (BIT)
- `AssignedReviewerId` (NVARCHAR(100), nullable)
- `AssignedReviewerDisplayName` (NVARCHAR(150), nullable)
- `SubmittedUtc` (DATETIME2)
- `CreatedUtc` (DATETIME2)
- `UpdatedUtc` (DATETIME2)
- `LastStatusChangedUtc` (DATETIME2)

---

### `IncidentEvidence`
Stores uploaded evidence file metadata.

#### Columns
- `EvidenceId` (UNIQUEIDENTIFIER, PK)
- `IncidentId` (UNIQUEIDENTIFIER, FK -> Incidents)
- `BlobName` (NVARCHAR(300))
- `OriginalFileName` (NVARCHAR(260))
- `ContentType` (NVARCHAR(100))
- `FileSizeBytes` (BIGINT)
- `Sha256Hash` (NVARCHAR(64), nullable)
- `StorageContainer` (NVARCHAR(100))
- `UploadStatus` (NVARCHAR(20))
- `UploadedByRole` (NVARCHAR(20))
- `UploadedUtc` (DATETIME2)

---

### `IncidentAudit`
Stores audit history for system/admin actions.

#### Columns
- `AuditId` (UNIQUEIDENTIFIER, PK)
- `IncidentId` (UNIQUEIDENTIFIER, FK -> Incidents)
- `ActionType` (NVARCHAR(50))
- `OldValueJson` (NVARCHAR(MAX), nullable)
- `NewValueJson` (NVARCHAR(MAX), nullable)
- `PerformedByType` (NVARCHAR(20))
- `PerformedById` (NVARCHAR(100), nullable)
- `PerformedByDisplayName` (NVARCHAR(150), nullable)
- `CorrelationId` (NVARCHAR(100), nullable)
- `PerformedUtc` (DATETIME2)

---

### `IncidentComments`
Stores internal admin/reviewer comments.

#### Columns
- `CommentId` (UNIQUEIDENTIFIER, PK)
- `IncidentId` (UNIQUEIDENTIFIER, FK -> Incidents)
- `CommentText` (NVARCHAR(MAX))
- `IsInternal` (BIT)
- `CreatedById` (NVARCHAR(100), nullable)
- `CreatedByDisplayName` (NVARCHAR(150), nullable)
- `CreatedUtc` (DATETIME2)

---

## Reference tables

### `RefStatus`
Allowed incident statuses.

### `RefSeverity`
Allowed severity values.

### `RefCategory`
Allowed category values.

### `RefReportType`
Allowed report types.

---

## Design notes

- `PublicId` is safe to share with submitters.
- `TrackingTokenHash` stores only a hash, never the raw token.
- Evidence files are stored in Blob Storage, but only metadata lives in SQL.
- Audit history is modeled separately for traceability.
- Reference tables keep enum-like values clean and queryable.