import { useEffect, useMemo, useState } from 'react'
import type {
  AddIncidentCommentRequest,
  IncidentDetail,
  UpdateIncidentRequest,
} from '../types/incident'
import type {
  CategoryCode,
  ReferenceDataResponse,
  SeverityCode,
  StatusCode,
} from '../types/reference-data'

interface IncidentDetailPanelProps {
  incident: IncidentDetail | null
  referenceData: ReferenceDataResponse | null
  saving: boolean
  onSave: (payload: UpdateIncidentRequest) => Promise<void>
  onAddComment: (payload: AddIncidentCommentRequest) => Promise<void>
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export default function IncidentDetailPanel({
  incident,
  referenceData,
  saving,
  onSave,
  onAddComment,
}: IncidentDetailPanelProps) {
  const [statusCode, setStatusCode] = useState<StatusCode | ''>('')
  const [severityCode, setSeverityCode] = useState<SeverityCode | ''>('')
  const [categoryCode, setCategoryCode] = useState<CategoryCode | ''>('')
  const [commentText, setCommentText] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!incident) {
      setStatusCode('')
      setSeverityCode('')
      setCategoryCode('')
      setCommentText('')
      setCommentSuccess('')
      setError('')
      return
    }

    setStatusCode(incident.statusCode)
    setSeverityCode(incident.severityCode)
    setCategoryCode(incident.categoryCode ?? '')
    setCommentText('')
    setCommentSuccess('')
    setError('')
  }, [incident])

  const statusOptions = useMemo(
    () => referenceData?.statuses ?? [],
    [referenceData]
  )

  const severityOptions = useMemo(
    () => referenceData?.severities ?? [],
    [referenceData]
  )

  const categoryOptions = useMemo(
    () => referenceData?.categories ?? [],
    [referenceData]
  )

  if (!incident) {
    return (
      <section>
        <h3>Incident detail</h3>
        <p>Select an incident to view details.</p>
      </section>
    )
  }

  async function handleSave() {
    setError('')
    setCommentSuccess('')

    try {
      await onSave({
        statusCode: statusCode || undefined,
        severityCode: severityCode || undefined,
        categoryCode: categoryCode || undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    }
  }

  async function handleCommentSubmit() {
    if (!commentText.trim()) {
      setError('Comment text is required.')
      return
    }

    setError('')
    setCommentSuccess('')

    try {
      await onAddComment({
        commentText: commentText.trim(),
      })
      setCommentText('')
      setCommentSuccess('Comment added successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comment submission failed.')
    }
  }

  return (
    <section>
      <h3>Incident detail</h3>

      <div style={detailGridStyle}>
        <DetailItem label="Incident ID" value={incident.incidentId} />
        <DetailItem label="Public ID" value={incident.publicId} />
        <DetailItem label="Title" value={incident.title} />
        <DetailItem label="Report Type" value={incident.reportTypeCode} />
        <DetailItem label="Category" value={incident.categoryCode ?? '—'} />
        <DetailItem label="Severity" value={incident.severityCode} />
        <DetailItem label="Status" value={incident.statusCode} />
        <DetailItem
          label="Submitted"
          value={formatDate(incident.submittedUtc)}
        />
        <DetailItem
          label="Updated"
          value={formatDate(incident.updatedUtc)}
        />
        <DetailItem
          label="Last Status Change"
          value={formatDate(incident.lastStatusChangedUtc)}
        />
        <DetailItem
          label="Anonymous"
          value={incident.isAnonymous ? 'Yes' : 'No'}
        />
        <DetailItem
          label="Submitter Name"
          value={incident.submitterName ?? '—'}
        />
        <DetailItem
          label="Submitter Email"
          value={incident.submitterEmail ?? '—'}
        />
        <DetailItem
          label="Assigned Reviewer"
          value={incident.assignedReviewerDisplayName ?? '—'}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Description</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{incident.description}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Update incident</h4>

        <div style={formGridStyle}>
          <label>
            Status
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value as StatusCode)}
            >
              {statusOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Severity
            <select
              value={severityCode}
              onChange={(e) =>
                setSeverityCode(e.target.value as SeverityCode)
              }
            >
              {severityOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Category
            <select
              value={categoryCode}
              onChange={(e) =>
                setCategoryCode(e.target.value as CategoryCode | '')
              }
            >
              <option value="">None</option>
              {categoryOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.displayName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{ marginTop: '1rem' }}
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>Add comment</h4>

        <textarea
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ width: '100%' }}
          placeholder="Write an internal comment..."
        />

        <button
          type="button"
          onClick={handleCommentSubmit}
          disabled={saving}
          style={{ marginTop: '1rem' }}
        >
          {saving ? 'Submitting...' : 'Add comment'}
        </button>

        <p style={{ marginTop: '0.75rem', color: 'gray' }}>
          Note: this UI adds a comment, but it does not yet display comment history
          because no comment-list endpoint has been wired yet.
        </p>
      </div>

      {commentSuccess && (
        <p style={{ marginTop: '1rem', color: 'green' }}>{commentSuccess}</p>
      )}

      {error && (
        <p style={{ marginTop: '1rem', color: 'crimson' }}>{error}</p>
      )}
    </section>
  )
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <strong>{label}</strong>
      <div>{value}</div>
    </div>
  )
}

const detailGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
  marginTop: '1rem',
}

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '1rem',
}