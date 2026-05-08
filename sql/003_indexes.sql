CREATE UNIQUE INDEX IX_Incidents_PublicId
    ON dbo.Incidents(PublicId);
GO

CREATE INDEX IX_Incidents_StatusCode
    ON dbo.Incidents(StatusCode);
GO

CREATE INDEX IX_Incidents_SeverityCode
    ON dbo.Incidents(SeverityCode);
GO

CREATE INDEX IX_Incidents_CategoryCode
    ON dbo.Incidents(CategoryCode);
GO

CREATE INDEX IX_Incidents_SubmittedUtc
    ON dbo.Incidents(SubmittedUtc DESC);
GO

CREATE INDEX IX_IncidentEvidence_IncidentId
    ON dbo.IncidentEvidence(IncidentId);
GO

CREATE INDEX IX_IncidentAudit_IncidentId_PerformedUtc
    ON dbo.IncidentAudit(IncidentId, PerformedUtc DESC);
GO

CREATE INDEX IX_IncidentComments_IncidentId_CreatedUtc
    ON dbo.IncidentComments(IncidentId, CreatedUtc DESC);
GO