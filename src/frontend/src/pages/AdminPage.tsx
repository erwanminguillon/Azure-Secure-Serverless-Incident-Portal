import { useEffect, useState } from 'react'
import {
  addIncidentComment,
  getIncidentById,
  getReferenceData,
  listIncidents,
  updateIncident,
} from '../api/internalApi'
import IncidentTable from '../components/IncidentTable'
import IncidentDetailPanel from '../components/IncidentDetailPanel'
import type {
  AdminIncidentListItem,
  IncidentDetail,
  AddIncidentCommentRequest,
  UpdateIncidentRequest,
} from '../types/incident'
import type { ReferenceDataResponse } from '../types/reference-data'

export default function AdminPage() {
  const [incidents, setIncidents] = useState<AdminIncidentListItem[]>([])
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null)
  const [referenceData, setReferenceData] = useState<ReferenceDataResponse | null>(null)

  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadInitialData() {
    setError('')
    setLoadingList(true)

    try {
      const [incidentListResponse, referenceDataResponse] = await Promise.all([
        listIncidents(),
        getReferenceData(),
      ])

      setIncidents(incidentListResponse.items)
      setReferenceData(referenceDataResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data.')
    } finally {
      setLoadingList(false)
    }
  }

  async function loadIncidentDetail(incidentId: string) {
    setError('')
    setLoadingDetail(true)

    try {
      const detail = await getIncidentById(incidentId)
      setSelectedIncident(detail)
      setSelectedIncidentId(incidentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load incident detail.')
    } finally {
      setLoadingDetail(false)
    }
  }

  async function handleSave(payload: UpdateIncidentRequest) {
    if (!selectedIncidentId) return

    setSaving(true)
    setError('')

    try {
      await updateIncident(selectedIncidentId, payload)
      await Promise.all([loadInitialData(), loadIncidentDetail(selectedIncidentId)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update incident.')
      throw err
    } finally {
      setSaving(false)
    }
  }

  async function handleAddComment(payload: AddIncidentCommentRequest) {
    if (!selectedIncidentId) return

    setSaving(true)
    setError('')

    try {
      await addIncidentComment(selectedIncidentId, payload)
      await loadIncidentDetail(selectedIncidentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment.')
      throw err
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    void loadInitialData()
  }, [])

  return (
    <section>
      <h2>Admin</h2>
      <p>Internal incident management console.</p>

      <button
        type="button"
        onClick={() => void loadInitialData()}
        disabled={loadingList}
        style={{ marginTop: '1rem' }}
      >
        {loadingList ? 'Refreshing...' : 'Refresh list'}
      </button>

      {error && (
        <p style={{ marginTop: '1rem', color: 'crimson' }}>{error}</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2rem',
          marginTop: '2rem',
          alignItems: 'start',
        }}
      >
        <div>
          <h3>Incidents</h3>

          {loadingList ? (
            <p>Loading incidents...</p>
          ) : (
            <IncidentTable
              items={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelect={(incidentId) => void loadIncidentDetail(incidentId)}
            />
          )}
        </div>

        <div>
          {loadingDetail ? (
            <p>Loading incident detail...</p>
          ) : (
            <IncidentDetailPanel
              incident={selectedIncident}
              referenceData={referenceData}
              saving={saving}
              onSave={handleSave}
              onAddComment={handleAddComment}
            />
          )}
        </div>
      </div>
    </section>
  )
}