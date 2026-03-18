import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Calendar, MapPin, Clock, Users, ArrowLeft, QrCode, Edit } from 'lucide-react'
import { format } from 'date-fns'

export function AdminEventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const [{ data: ev }, { data: regs }] = await Promise.all([
        supabase.from('events').select('*').eq('id', id).single(),
        supabase.from('registrations').select('*, profiles(full_name, email)').eq('event_id', id).order('registered_at', { ascending: false }),
      ])
      setEvent(ev)
      setRegistrations(regs || [])
      setLoading(false)
    }
    fetch()
  }, [id])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><span className="spinner" style={{ width: 32, height: 32 }} /></div>
  if (!event) return <p>Event not found</p>

  const checkedIn = registrations.filter(r => r.status === 'checked_in').length
  const remaining = event.capacity - registrations.length
  const pct = Math.min((registrations.length / event.capacity) * 100, 100)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .ed-wrap { font-family:'IBM Plex Sans',sans-serif !important; }

        .ed-back-btn {
          display:inline-flex !important;
          align-items:center !important;
          justify-content:center !important;
          width:36px !important; height:36px !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          color:rgba(255,255,255,0.5) !important;
          cursor:pointer !important;
          text-decoration:none !important;
          transition:all 0.15s !important;
          flex-shrink:0 !important;
        }
        .ed-back-btn:hover { background:rgba(255,255,255,0.08) !important; color:#fff !important; }

        .ed-page-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:18px !important;
          font-weight:700 !important;
          color:#fff !important;
          letter-spacing:-0.3px !important;
          flex:1 !important;
          margin:0 !important;
        }

        .ed-badge-published { background:rgba(74,222,128,0.12) !important; color:#4ade80 !important; border:0.5px solid rgba(74,222,128,0.3) !important; font-size:11px !important; font-weight:600 !important; padding:4px 12px !important; border-radius:100px !important; }
        .ed-badge-draft { background:rgba(255,255,255,0.06) !important; color:rgba(255,255,255,0.4) !important; border:0.5px solid rgba(255,255,255,0.1) !important; font-size:11px !important; font-weight:600 !important; padding:4px 12px !important; border-radius:100px !important; }
        .ed-badge-cancelled { background:rgba(239,68,68,0.12) !important; color:#f87171 !important; border:0.5px solid rgba(239,68,68,0.3) !important; font-size:11px !important; font-weight:600 !important; padding:4px 12px !important; border-radius:100px !important; }
        .ed-badge-completed { background:rgba(59,130,246,0.12) !important; color:#60a5fa !important; border:0.5px solid rgba(59,130,246,0.3) !important; font-size:11px !important; font-weight:600 !important; padding:4px 12px !important; border-radius:100px !important; }

        .ed-btn-edit {
          display:inline-flex !important;
          align-items:center !important;
          gap:6px !important;
          padding:8px 14px !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          color:rgba(255,255,255,0.5) !important;
          font-size:12px !important;
          font-weight:500 !important;
          text-decoration:none !important;
          transition:all 0.15s !important;
          font-family:'IBM Plex Sans',sans-serif !important;
        }
        .ed-btn-edit:hover { background:rgba(255,255,255,0.08) !important; color:#fff !important; }

        .ed-btn-checkin {
          display:inline-flex !important;
          align-items:center !important;
          gap:6px !important;
          padding:8px 16px !important;
          background:linear-gradient(135deg,#3b82f6,#6366f1) !important;
          border:none !important;
          border-radius:10px !important;
          color:#fff !important;
          font-size:12px !important;
          font-weight:600 !important;
          text-decoration:none !important;
          font-family:'Space Grotesk',sans-serif !important;
          transition:opacity 0.2s, transform 0.15s !important;
        }
        .ed-btn-checkin:hover { opacity:0.88 !important; transform:translateY(-1px) !important; }

        .ed-hero {
          background:linear-gradient(135deg,rgba(59,130,246,0.12) 0%,rgba(99,102,241,0.08) 100%) !important;
          border:0.5px solid rgba(59,130,246,0.15) !important;
          border-radius:18px !important;
          padding:32px !important;
          margin-bottom:20px !important;
          position:relative !important;
          overflow:hidden !important;
        }

        .ed-hero-glow {
          position:absolute !important;
          top:-60px !important; right:-60px !important;
          width:240px !important; height:240px !important;
          background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .ed-hero-glow2 {
          position:absolute !important;
          bottom:-40px !important; left:-40px !important;
          width:180px !important; height:180px !important;
          background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .ed-hero-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:40px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:10px !important;
          position:relative !important;
        }

        .ed-hero-desc {
          font-size:13px !important;
          color:rgba(255,255,255,0.4) !important;
          font-weight:300 !important;
          line-height:1.6 !important;
          max-width:600px !important;
          margin-bottom:20px !important;
          position:relative !important;
        }

        .ed-hero-meta {
          display:flex !important;
          gap:20px !important;
          flex-wrap:wrap !important;
          position:relative !important;
          margin-bottom:20px !important;
        }

        .ed-hero-meta-item {
          display:flex !important;
          align-items:center !important;
          gap:7px !important;
          font-size:13px !important;
          color:rgba(255,255,255,0.6) !important;
          font-weight:300 !important;
        }

        .ed-progress-wrap {
          position:relative !important;
          height:4px !important;
          background:rgba(255,255,255,0.08) !important;
          border-radius:4px !important;
          overflow:hidden !important;
          max-width:400px !important;
        }

        .ed-progress-bar {
          height:100% !important;
          background:linear-gradient(90deg,#3b82f6,#6366f1) !important;
          border-radius:4px !important;
          transition:width 0.4s !important;
        }

        .ed-progress-label {
          font-size:11px !important;
          color:rgba(255,255,255,0.25) !important;
          font-weight:300 !important;
          margin-top:6px !important;
          position:relative !important;
        }

        .ed-stats {
          display:grid !important;
          grid-template-columns:repeat(3,1fr) !important;
          gap:14px !important;
          margin-bottom:20px !important;
        }

        .ed-stat-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:14px !important;
          padding:20px !important;
          text-align:center !important;
          transition:transform 0.18s, border-color 0.18s !important;
        }
        .ed-stat-card:hover { transform:translateY(-2px) !important; border-color:rgba(59,130,246,0.2) !important; }

        .ed-stat-value {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:40px !important;
          font-weight:700 !important;
          letter-spacing:-2px !important;
          line-height:1 !important;
          margin-bottom:6px !important;
        }

        .ed-stat-label {
          font-size:12px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
        }

        .ed-table-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:16px !important;
          padding:20px !important;
          overflow:hidden !important;
        }

        .ed-table-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:14px !important;
          font-weight:600 !important;
          color:#fff !important;
          margin-bottom:16px !important;
          padding-bottom:12px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .ed-table {
          width:100% !important;
          border-collapse:collapse !important;
          font-size:13px !important;
        }

        .ed-th {
          text-align:left !important;
          padding:8px 12px !important;
          color:rgba(255,255,255,0.25) !important;
          font-weight:500 !important;
          font-size:10px !important;
          letter-spacing:1.2px !important;
          text-transform:uppercase !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .ed-tr {
          border-bottom:0.5px solid rgba(255,255,255,0.04) !important;
          transition:background 0.15s !important;
        }
        .ed-tr:hover { background:rgba(59,130,246,0.03) !important; }
        .ed-tr:last-child { border-bottom:none !important; }

        .ed-td {
          padding:12px !important;
          color:rgba(255,255,255,0.7) !important;
          font-weight:300 !important;
        }

        .ed-td-name {
          font-weight:500 !important;
          color:#fff !important;
        }

        .ed-td-code {
          font-family:monospace !important;
          font-size:11px !important;
          color:rgba(255,255,255,0.2) !important;
        }

        .ed-td-date {
          font-size:11px !important;
          color:rgba(255,255,255,0.25) !important;
        }

        .ed-reg-badge-registered { background:rgba(59,130,246,0.12) !important; color:#60a5fa !important; border:0.5px solid rgba(59,130,246,0.25) !important; font-size:10px !important; font-weight:600 !important; padding:3px 8px !important; border-radius:100px !important; }
        .ed-reg-badge-checked_in { background:rgba(74,222,128,0.12) !important; color:#4ade80 !important; border:0.5px solid rgba(74,222,128,0.25) !important; font-size:10px !important; font-weight:600 !important; padding:3px 8px !important; border-radius:100px !important; }
        .ed-reg-badge-cancelled { background:rgba(239,68,68,0.12) !important; color:#f87171 !important; border:0.5px solid rgba(239,68,68,0.25) !important; font-size:10px !important; font-weight:600 !important; padding:3px 8px !important; border-radius:100px !important; }
      `}</style>

      <div className="ed-wrap fade-in">
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/admin/events" className="ed-back-btn"><ArrowLeft size={16} /></Link>
          <div className="ed-page-title">{event.title}</div>
          <span className={`ed-badge-${event.status}`}>{event.status}</span>
          <Link to={`/admin/events/edit/${id}`} className="ed-btn-edit"><Edit size={13} /> Edit</Link>
          <Link to={`/admin/checkin?event=${id}`} className="ed-btn-checkin"><QrCode size={13} /> Launch Check-In</Link>
        </div>

        {/* Hero */}
        <div className="ed-hero">
          <div className="ed-hero-glow" />
          <div className="ed-hero-glow2" />
          <div className="ed-hero-title">{event.title}</div>
          {event.description && <div className="ed-hero-desc">{event.description}</div>}
          <div className="ed-hero-meta">
            <div className="ed-hero-meta-item"><Calendar size={14} color="#60a5fa" />{format(new Date(event.event_date), 'MMMM d, yyyy')} · {event.event_time}</div>
            <div className="ed-hero-meta-item"><MapPin size={14} color="#60a5fa" />{event.location}</div>
            <div className="ed-hero-meta-item"><Users size={14} color="#60a5fa" />{registrations.length}/{event.capacity} registered</div>
          </div>
          <div className="ed-progress-wrap">
            <div className="ed-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div className="ed-progress-label">{Math.round(pct)}% capacity filled</div>
        </div>

        {/* Stats */}
        <div className="ed-stats">
          <div className="ed-stat-card">
            <div className="ed-stat-value" style={{ color: '#f59e0b' }}>{registrations.length}</div>
            <div className="ed-stat-label">Registered</div>
          </div>
          <div className="ed-stat-card">
            <div className="ed-stat-value" style={{ color: '#4ade80' }}>{checkedIn}</div>
            <div className="ed-stat-label">Checked In</div>
          </div>
          <div className="ed-stat-card">
            <div className="ed-stat-value" style={{ color: '#60a5fa' }}>{remaining}</div>
            <div className="ed-stat-label">Remaining</div>
          </div>
        </div>

        {/* Registrations table */}
        <div className="ed-table-card">
          <div className="ed-table-title">Registrations ({registrations.length})</div>
          {registrations.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 20, fontSize: 13, fontWeight: 300 }}>No registrations yet</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="ed-table">
                <thead>
                  <tr>
                    {['Name', 'Email', 'Ticket Code', 'Status', 'Registered'].map(h => (
                      <th key={h} className="ed-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(r => (
                    <tr key={r.id} className="ed-tr">
                      <td className="ed-td ed-td-name">{r.profiles?.full_name}</td>
                      <td className="ed-td">{r.profiles?.email}</td>
                      <td className="ed-td ed-td-code">{r.ticket_code.slice(0, 12)}...</td>
                      <td className="ed-td"><span className={`ed-reg-badge-${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                      <td className="ed-td ed-td-date">{format(new Date(r.registered_at), 'MMM d, yyyy HH:mm')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}