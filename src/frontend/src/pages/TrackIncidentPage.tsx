import { useState } from 'react'
import { trackIncident } from '../api/incidentApi'

export default function TrackIncidentPage() {
  const [publicId, setPublicId] = useState('')
  const [trackingToken, setTrackingToken] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult('')
    setLoading(true)

    try {
      const response = await trackIncident({
        publicId,
        trackingToken,
      })

      setResult(JSON.stringify(response, null, 2))
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Tracking failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <h2>Track Incident</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '1rem', maxWidth: 600 }}
      >
        <label>
          Public ID
          <input
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            required
          />
        </label>

        <label>
          Tracking Token
          <input
            value={trackingToken}
            onChange={(e) => setTrackingToken(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Track Incident'}
        </button>
      </form>

      {result && (
        <pre style={{ marginTop: '1rem', background: '#111', color: '#fff', padding: '1rem' }}>
          {result}
        </pre>
      )}

      {error && (
        <p style={{ marginTop: '1rem', color: 'crimson' }}>
          {error}
        </p>
      )}
    </section>
  )
}
``