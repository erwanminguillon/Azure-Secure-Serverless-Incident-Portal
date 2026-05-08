# API Endpoints

## Overview

The API is split into:

- **public routes** for anonymous submitters
- **admin routes** for authenticated reviewers/admins

---

# Public endpoints

## Submit incident
**POST** `/api/public/incidents`

Creates a new incident report and returns:
- `incidentId`
- `publicId`
- `trackingToken`
- `submittedUtc`

### Request body
```json
{
  "title": "Suspicious login alert from unknown location",
  "description": "I received a login alert for an account I did not access.",
  "reportTypeCode": "incident",
  "categoryCode": "account_compromise",
  "severityCode": "medium",
  "submitterName": "Jane Doe",
  "submitterEmail": "jane@example.com",
  "isAnonymous": false
}