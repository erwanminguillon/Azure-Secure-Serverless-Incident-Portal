import { useState } from 'react'
import { submitIncident } from '../api/incidentApi'
import type { CategoryCode, ReportTypeCode, SeverityCode } from '../types/reference-data'

export default function SubmitIncidentPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [reportTypeCode, setReportTypeCode] = useState<ReportTypeCode>('incident')
  const [categoryCode, setCategoryCode] = useState<CategoryCode | ''>('')
  const [severityCode, setSeverityCode] = useState<SeverityCode>('medium')

  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const [publicId, setPublicId] = useState('')
  const [trackingToken, setTrackingToken] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPublicId('')
    setTrackingToken('')
    setSuccessMessage('')
    setLoading(true)

    try {
      const result = await submitIncident({
        title,
        description,
        reportTypeCode,
        categoryCode: categoryCode || undefined,
        severityCode,
        submitterName: isAnonymous ? undefined : submitterName || undefined,
        submitterEmail: isAnonymous ? undefined : submitterEmail || undefined,
        isAnonymous,
      })

      setPublicId(result.publicId)
      setTrackingToken(result.trackingToken)
      setSuccessMessage(result.message)

      setTitle('')
      setDescription('')
      setReportTypeCode('incident')
      setCategoryCode('')
      setSeverityCode('medium')
      setSubmitterName('')
      setSubmitterEmail('')
      setIsAnonymous(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Submission failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Submit Incident</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '1rem', maxWidth: 720 }}
      >
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
        </label>

        <label>
          Report type
          <select
            value={reportTypeCode}
            onChange={(e) => setReportTypeCode(e.target.value as ReportTypeCode)}
          >
            <option value="incident">Incident</option>
            <option value="vulnerability">Vulnerability</option>
            <option value="suspicious_activity">Suspicious activity</option>
          </select>
        </label>

        <label>
          Category
          <select
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value as CategoryCode | '')}
          >
            <option value="">No category</option>
            <option value="phishing">Phishing</option>
            <option value="malware">Malware</option>
            <option value="account_compromise">Account compromise</option>
            <option value="vulnerability">Vulnerability</option>
            <option value="suspicious_activity">Suspicious activity</option>
            <option value="data_exposure">Data exposure</option>
            <option value="policy_violation">Policy violation</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Severity
          <select
            value={severityCode}
            onChange={(e) => setSeverityCode(e.target.value as SeverityCode)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>

        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Submit anonymously
        </label>

        {!isAnonymous && (
          <>
            <label>
              Your name
              <input
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
            </label>

            <label>
              Your email
              <input
                type="email"
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
              />
            </label>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Incident'}
        </button>
      </form>

      {successMessage && (
        <p style={{ marginTop: '1rem', color: 'green' }}>
          {successMessage}
        </p>
      )}

      {publicId && trackingToken && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <p>
            <strong>Public ID:</strong> {publicId}
          </p>
          <p>
            <strong>Tracking Token:</strong> {trackingToken}
          </p>
          <p>
            Save both values. You will need them to track this incident later.
          </p>
        </div>
      )}

      {error && (
        <p style={{ marginTop: '1rem', color: 'crimson' }}>
          {error}
        </p>
      )}
    </section>
  )
}
