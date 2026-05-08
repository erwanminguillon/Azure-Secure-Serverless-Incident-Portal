CREATE TABLE dbo.RefStatus (
    StatusCode NVARCHAR(30) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(50) NOT NULL,
    SortOrder INT NOT NULL,
    IsTerminal BIT NOT NULL
);
GO

CREATE TABLE dbo.RefSeverity (
    SeverityCode NVARCHAR(20) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(30) NOT NULL,
    SortOrder INT NOT NULL
);
GO

CREATE TABLE dbo.RefCategory (
    CategoryCode NVARCHAR(50) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(100) NOT NULL,
    SortOrder INT NOT NULL
);
GO

CREATE TABLE dbo.RefReportType (
    ReportTypeCode NVARCHAR(50) NOT NULL PRIMARY KEY,
    DisplayName NVARCHAR(100) NOT NULL,
    SortOrder INT NOT NULL
);
GO

CREATE TABLE dbo.Incidents (
    IncidentId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    PublicId NVARCHAR(30) NOT NULL UNIQUE,
    TrackingTokenHash NVARCHAR(255) NOT NULL,

    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,

    ReportTypeCode NVARCHAR(50) NOT NULL,
    CategoryCode NVARCHAR(50) NULL,
    SeverityCode NVARCHAR(20) NOT NULL,
    StatusCode NVARCHAR(30) NOT NULL,

    SubmitterName NVARCHAR(150) NULL,
    SubmitterEmail NVARCHAR(256) NULL,
    IsAnonymous BIT NOT NULL DEFAULT 1,

    AssignedReviewerId NVARCHAR(100) NULL,
    AssignedReviewerDisplayName NVARCHAR(150) NULL,

    SubmittedUtc DATETIME2 NOT NULL,
    CreatedUtc DATETIME2 NOT NULL,
    UpdatedUtc DATETIME2 NOT NULL,
    LastStatusChangedUtc DATETIME2 NOT NULL,

    CONSTRAINT FK_Incidents_RefReportType
        FOREIGN KEY (ReportTypeCode) REFERENCES dbo.RefReportType(ReportTypeCode),

    CONSTRAINT FK_Incidents_RefCategory
        FOREIGN KEY (CategoryCode) REFERENCES dbo.RefCategory(CategoryCode),

    CONSTRAINT FK_Incidents_RefSeverity
        FOREIGN KEY (SeverityCode) REFERENCES dbo.RefSeverity(SeverityCode),

    CONSTRAINT FK_Incidents_RefStatus
        FOREIGN KEY (StatusCode) REFERENCES dbo.RefStatus(StatusCode)
);
GO

CREATE TABLE dbo.IncidentEvidence (
    EvidenceId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    IncidentId UNIQUEIDENTIFIER NOT NULL,
    BlobName NVARCHAR(300) NOT NULL,
    OriginalFileName NVARCHAR(260) NOT NULL,
    ContentType NVARCHAR(100) NOT NULL,
    FileSizeBytes BIGINT NOT NULL,
    Sha256Hash NVARCHAR(64) NULL,
    StorageContainer NVARCHAR(100) NOT NULL,
    UploadStatus NVARCHAR(20) NOT NULL,
    UploadedByRole NVARCHAR(20) NOT NULL,
    UploadedUtc DATETIME2 NOT NULL,

    CONSTRAINT FK_IncidentEvidence_Incidents
        FOREIGN KEY (IncidentId) REFERENCES dbo.Incidents(IncidentId)
);
GO

CREATE TABLE dbo.IncidentAudit (
    AuditId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    IncidentId UNIQUEIDENTIFIER NOT NULL,
    ActionType NVARCHAR(50) NOT NULL,
    OldValueJson NVARCHAR(MAX) NULL,
    NewValueJson NVARCHAR(MAX) NULL,
    PerformedByType NVARCHAR(20) NOT NULL,
    PerformedById NVARCHAR(100) NULL,
    PerformedByDisplayName NVARCHAR(150) NULL,
    CorrelationId NVARCHAR(100) NULL,
    PerformedUtc DATETIME2 NOT NULL,

    CONSTRAINT FK_IncidentAudit_Incidents
        FOREIGN KEY (IncidentId) REFERENCES dbo.Incidents(IncidentId)
);
GO

CREATE TABLE dbo.IncidentComments (
    CommentId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    IncidentId UNIQUEIDENTIFIER NOT NULL,
    CommentText NVARCHAR(MAX) NOT NULL,
    IsInternal BIT NOT NULL DEFAULT 1,
    CreatedById NVARCHAR(100) NULL,
    CreatedByDisplayName NVARCHAR(150) NULL,
    CreatedUtc DATETIME2 NOT NULL,

    CONSTRAINT FK_IncidentComments_Incidents
        FOREIGN KEY (IncidentId) REFERENCES dbo.Incidents(IncidentId)
);
GO