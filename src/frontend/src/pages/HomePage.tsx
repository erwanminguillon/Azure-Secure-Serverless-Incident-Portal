import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section>
      <h2>Welcome</h2>
      <p>This portal lets users submit and track incidents securely.</p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to="/submit">
          <button type="button">Submit Incident</button>
        </Link>

        <Link to="/track">
          <button type="button">Track Incident</button>
        </Link>

        <Link to="/admin">
          <button type="button">Admin</button>
        </Link>
      </div>
    </section>
  )
}