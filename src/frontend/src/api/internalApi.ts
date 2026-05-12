import { buildApiUrl } from './config'
import type {
  AddIncidentCommentRequest,
  AdminIncidentListResponse,
  IncidentComment,
  IncidentDetail,
  UpdateIncidentRequest,
  UpdateIncidentResponse,
} from '../types/incident'
import type { ReferenceDataResponse } from '../types/reference-data'
import type { ApiErrorResponse } from '../types/api'

async function handleJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const errorBody = (await response.json()) as Partial<ApiErrorResponse>

      const message =
        typeof errorBody.error?.message === 'string'
          ? errorBody.error.message
          : `HTTP ${response.status}`

      throw new Error(message)
    }

    const text = await response.text()
    throw new Error(text || `HTTP ${response.status}`)
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Expected JSON response.')
  }

  return (await response.json()) as T
}


export async function getReferenceData(): Promise<ReferenceDataResponse> {
  const response = await fetch(buildApiUrl('/internal/reference-data'), {
    method: 'GET',
  })

  return handleJsonResponse<ReferenceDataResponse>(response)
}

export async function listIncidents(): Promise<AdminIncidentListResponse> {
  const response = await fetch(buildApiUrl('/internal/incidents'), {
    method: 'GET',
  })

  return handleJsonResponse<AdminIncidentListResponse>(response)
}

export async function getIncidentById(
  incidentId: string
): Promise<IncidentDetail> {
  const response = await fetch(
    buildApiUrl(`/internal/incidents/${encodeURIComponent(incidentId)}`),
    {
      method: 'GET',
    }
  )

  return handleJsonResponse<IncidentDetail>(response)
}

export async function updateIncident(
  incidentId: string,
  payload: UpdateIncidentRequest
): Promise<UpdateIncidentResponse> {
  const response = await fetch(
    buildApiUrl(`/internal/incidents/${encodeURIComponent(incidentId)}`),
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  return handleJsonResponse<UpdateIncidentResponse>(response)
}

export async function addIncidentComment(
  incidentId: string,
  payload: AddIncidentCommentRequest
): Promise<IncidentComment> {
  const response = await fetch(
    buildApiUrl(`/internal/incidents/${encodeURIComponent(incidentId)}/comments`),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  return handleJsonResponse<IncidentComment>(response)
}