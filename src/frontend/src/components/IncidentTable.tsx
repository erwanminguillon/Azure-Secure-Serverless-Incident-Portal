import type { AdminIncidentListItem } from '../types/incident'

interface IncidentTableProps {
  items: AdminIncidentListItem[]
  selectedIncidentId: string | null
  onSelect: (incidentId: string) => void
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export default function IncidentTable({
  items,
  selectedIncidentId,
  onSelect,
}: IncidentTableProps) {
  if (items.length === 0) {
    return <p>No incidents found.</p>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Public ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Report Type</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Severity</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = item.incidentId === selectedIncidentId

            return (
              <tr
                key={item.incidentId}
                onClick={() => onSelect(item.incidentId)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#eef6ff' : 'transparent',
                }}
              >
                <td style={tdStyle}>{item.publicId}</td>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.reportTypeCode}</td>
                <td style={tdStyle}>{item.categoryCode ?? '—'}</td>
                <td style={tdStyle}>{item.severityCode}</td>
                <td style={tdStyle}>{item.statusCode}</td>
                <td style={tdStyle}>{formatDate(item.submittedUtc)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #ccc',
  padding: '0.75rem',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem',
  verticalAlign: 'top',
}