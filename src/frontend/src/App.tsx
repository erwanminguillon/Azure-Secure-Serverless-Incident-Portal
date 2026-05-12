import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SubmitIncidentPage from './pages/SubmitIncidentPage'
import TrackIncidentPage from './pages/TrackIncidentPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1>Secure Serverless Incident Portal</h1>
          <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/">Home</Link>
            <Link to="/submit">Submit Incident</Link>
            <Link to="/track">Track Incident</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitIncidentPage />} />
            <Route path="/track" element={<TrackIncidentPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App