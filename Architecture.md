                           ┌────────────────────────────────────┐
                           │       Azure Static Web Apps        │
                           │  React/Vite frontend + routing     │
                           │  Public pages + protected admin    │
                           └───────────────┬────────────────────┘
                                           │
                                           │ HTTPS
                                           ▼
                           ┌────────────────────────────────────┐
                           │         Azure Functions            │
                           │  HTTP API / validation / authz     │
                           │  Incident CRUD / triage / uploads  │
                           └───────┬───────────────┬────────────┘
                                   │               │
                       Managed Identity      Managed Identity
                                   │               │
                                   ▼               ▼
                    ┌────────────────────┐   ┌──────────────────────┐
                    │ Azure SQL Database │   │ Azure Blob Storage   │
                    │ incidents metadata │   │ evidence files       │
                    │ audit/status data  │   │ screenshots/docs     │
                    └────────────────────┘   └──────────────────────┘
    
                              │
                              ▼
                    ┌────────────────────────────────────┐
                    │ Azure Monitor / Application Insights│
                    │ lightweight telemetry + error logs  │
                    └────────────────────────────────────┘
