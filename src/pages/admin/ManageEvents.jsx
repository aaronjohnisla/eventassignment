import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/Toast'

export function ManageEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const { toast, showToast } = useToast()

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*, registrations(count)')
      .order('event_date', { ascending: false })
    setEvents(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    await supabase.from('events').delete().eq('id', id)
    setDeleteId(null)
    showToast('Event deleted', 'success')
    fetchEvents()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .me-wrap { font-family: 'IBM Plex Sans', sans-serif !important; }

        .me-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 26px !important;
          font-weight: 700 !important;
          color: #fff !important;
          letter-spacing: -0.5px !important;
          margin-bottom: 4px !important;
        }

        .me-subtitle {
          font-size: 13px !important;
          color: rgba(255,255,255,0.35) !important;
          font-weight: 300 !important;
        }

        .me-create-btn {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 10px 18px !important;
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #fff !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          transition: opacity 0.2s, transform 0.15s !important;
        }
        .me-create-btn:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }

        .me-card {
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          border-radius: 14px !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s !important;
        }
        .me-card:hover {
          transform: translateY(-3px) !important;
          border-color: rgba(59,130,246,0.25) !important;
          box-shadow: 0 8px 28px rgba(0,0,0,0.3) !important;
        }

        .me-card-top {
          padding: 18px 20px 14px !important;
          border-bottom: 0.5px solid rgba(255,255,255,0.06) !important;
        }

        .me-date-block {
          background: rgba(59,130,246,0.1) !important;
          border: 0.5px solid rgba(59,130,246,0.2) !important;
          border-radius: 9px !important;
          padding: 6px 10px !important;
          text-align: center !important;
          min-width: 48px !important;
        }

        .me-date-month {
          font-size: 10px !important;
          color: #60a5fa !important;
          font-weight: 600 !important;
          letter-spacing: 1px !important;
        }

        .me-date-day {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 20px !important;
          font-weight: 800 !important;
          color: #fff !important;
          line-height: 1 !important;
        }

        .me-event-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
          line-height: 1.3 !important;
          margin: 0 !important;
        }

        .me-desc {
          font-size: 12px !important;
          color: rgba(255,255,255,0.3) !important;
          line-height: 1.5 !important;
          margin-top: 8px !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }

        .me-badge-published { background: rgba(74,222,128,0.12) !important; color: #4ade80 !important; border: 0.5px solid rgba(74,222,128,0.25) !important; border-radius: 100px !important; font-size: 10px !important; font-weight: 500 !important; padding: 3px 10px !important; white-space: nowrap !important; }
        .me-badge-draft { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.4) !important; border: 0.5px solid rgba(255,255,255,0.1) !important; border-radius: 100px !important; font-size: 10px !important; font-weight: 500 !important; padding: 3px 10px !important; white-space: nowrap !important; }
        .me-badge-cancelled { background: rgba(239,68,68,0.12) !important; color: #f87171 !important; border: 0.5px solid rgba(239,68,68,0.25) !important; border-radius: 100px !important; font-size: 10px !important; font-weight: 500 !important; padding: 3px 10px !important; white-space: nowrap !important; }
        .me-badge-completed { background: rgba(59,130,246,0.12) !important; color: #60a5fa !important; border: 0.5px solid rgba(59,130,246,0.25) !important; border-radius: 100px !important; font-size: 10px !important; font-weight: 500 !important; padding: 3px 10px !important; white-space: nowrap !important; }

        .me-card-meta {
          padding: 10px 20px !important;
          display: flex !important;
          gap: 14px !important;
          flex-wrap: wrap !important;
        }

        .me-meta-item {
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
          font-size: 12px !important;
          color: rgba(255,255,255,0.3) !important;
          font-weight: 300 !important;
        }

        .me-card-actions {
          padding: 10px 20px !important;
          border-top: 0.5px solid rgba(255,255,255,0.06) !important;
          display: flex !important;
          gap: 8px !important;
        }

        .me-btn-edit {
          flex: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 8px 12px !important;
          background: rgba(59,130,246,0.08) !important;
          border: 0.5px solid rgba(59,130,246,0.2) !important;
          border-radius: 8px !important;
          color: #60a5fa !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          transition: background 0.15s !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
        }
        .me-btn-edit:hover { background: rgba(59,130,246,0.15) !important; }

        .me-btn-delete {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 8px 10px !important;
          background: rgba(239,68,68,0.08) !important;
          border: 0.5px solid rgba(239,68,68,0.2) !important;
          border-radius: 8px !important;
          color: #f87171 !important;
          cursor: pointer !important;
          transition: background 0.15s !important;
        }
        .me-btn-delete:hover { background: rgba(239,68,68,0.15) !important; }

        .me-btn-view {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 8px 10px !important;
          background: rgba(255,255,255,0.03) !important;
          border: 0.5px solid rgba(255,255,255,0.08) !important;
          border-radius: 8px !important;
          color: rgba(255,255,255,0.4) !important;
          text-decoration: none !important;
          transition: background 0.15s !important;
        }
        .me-btn-view:hover { background: rgba(255,255,255,0.07) !important; color: #fff !important; }

        .me-modal-overlay {
          position: fixed !important; inset: 0 !important;
          background: rgba(0,0,0,0.7) !important;
          backdrop-filter: blur(4px) !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          z-index: 100 !important;
          padding: 20px !important;
        }

        .me-modal {
          background: #0c1120 !important;
          border: 0.5px solid rgba(255,255,255,0.1) !important;
          border-radius: 16px !important;
          width: 100% !important; max-width: 420px !important;
          overflow: hidden !important;
        }

        .me-modal-header {
          padding: 20px 24px !important;
          border-bottom: 0.5px solid rgba(255,255,255,0.06) !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          color: #fff !important;
        }

        .me-modal-body {
          padding: 20px 24px !important;
          font-size: 13px !important;
          color: rgba(255,255,255,0.4) !important;
          font-weight: 300 !important;
          line-height: 1.6 !important;
        }

        .me-modal-footer {
          padding: 14px 24px !important;
          border-top: 0.5px solid rgba(255,255,255,0.06) !important;
          display: flex !important;
          gap: 10px !important;
          justify-content: flex-end !important;
        }

        .me-btn-cancel {
          padding: 9px 18px !important;
          background: rgba(255,255,255,0.04) !important;
          border: 0.5px solid rgba(255,255,255,0.1) !important;
          border-radius: 8px !important;
          color: rgba(255,255,255,0.5) !important;
          font-size: 13px !important;
          cursor: pointer !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          transition: background 0.15s !important;
        }
        .me-btn-cancel:hover { background: rgba(255,255,255,0.08) !important; }

        .me-btn-confirm-delete {
          padding: 9px 18px !important;
          background: rgba(239,68,68,0.15) !important;
          border: 0.5px solid rgba(239,68,68,0.3) !important;
          border-radius: 8px !important;
          color: #f87171 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          transition: background 0.15s !important;
        }
        .me-btn-confirm-delete:hover { background: rgba(239,68,68,0.25) !important; }
      `}</style>

      <div className="me-wrap fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="me-title">Events Management</div>
            <div className="me-subtitle">Create, update, and monitor campus activities.</div>
          </div>
          <Link to="/admin/events/create" className="me-create-btn">
            <Plus size={15} /> Create Event
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No events yet</h3>
            <p>Create your first campus event</p>
            <Link to="/admin/events/create" className="me-create-btn" style={{ marginTop: 16 }}>
              <Plus size={15} /> Create Event
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {events.map(event => (
              <div key={event.id} className="me-card">
                <div className="me-card-top">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div className="me-date-block">
                        <div className="me-date-month">{format(new Date(event.event_date), 'MMM').toUpperCase()}</div>
                        <div className="me-date-day">{format(new Date(event.event_date), 'd')}</div>
                      </div>
                      <div className="me-event-title">{event.title}</div>
                    </div>
                    <span className={`me-badge-${event.status}`}>{event.status}</span>
                  </div>
                  {event.description && <div className="me-desc">{event.description}</div>}
                </div>

                <div className="me-card-meta">
                  <span className="me-meta-item"><Clock size={12} color="#60a5fa" />{event.event_time}</span>
                  <span className="me-meta-item"><MapPin size={12} color="#60a5fa" />{event.location}</span>
                  <span className="me-meta-item" style={{ marginLeft: 'auto' }}>
                    <Users size={12} />{event.registrations?.[0]?.count ?? 0}/{event.capacity}
                  </span>
                </div>

                <div className="me-card-actions">
                  <Link to={`/admin/events/edit/${event.id}`} className="me-btn-edit">
                    <Edit size={13} /> Edit
                  </Link>
                  <button onClick={() => setDeleteId(event.id)} className="me-btn-delete">
                    <Trash2 size={13} />
                  </button>
                  <Link to={`/admin/events/${event.id}`} className="me-btn-view">
                    <Eye size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteId && (
          <div className="me-modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="me-modal" onClick={e => e.stopPropagation()}>
              <div className="me-modal-header">Delete Event</div>
              <div className="me-modal-body">
                Are you sure you want to delete this event? All registrations will also be deleted. This action cannot be undone.
              </div>
              <div className="me-modal-footer">
                <button className="me-btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="me-btn-confirm-delete" onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        <Toast toast={toast} />
      </div>
    </>
  )
}