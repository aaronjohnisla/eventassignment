import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/Toast'
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react'
import { format } from 'date-fns'

export function BrowseEvents() {
  const [events, setEvents] = useState([])
  const [myRegistrations, setMyRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [registering, setRegistering] = useState(null)
  const { user } = useAuth()
  const { toast, showToast } = useToast()

  useEffect(() => {
    Promise.all([
      supabase.from('events').select('*, registrations(count)').eq('status', 'published').order('event_date'),
      supabase.from('registrations').select('event_id').eq('user_id', user.id),
    ]).then(([{ data: evts }, { data: regs }]) => {
      setEvents(evts || [])
      setMyRegistrations((regs || []).map(r => r.event_id))
      setLoading(false)
    })
  }, [user.id])

  async function handleRegister(eventId) {
    setRegistering(eventId)
    const { error } = await supabase.from('registrations').insert({ event_id: eventId, user_id: user.id })
    setRegistering(null)
    if (error) { showToast(error.message, 'error'); return }
    setMyRegistrations(prev => [...prev, eventId])
    showToast("You're registered! Check My Tickets for your QR code.", 'success')
  }

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .be-wrap { font-family:'IBM Plex Sans',sans-serif !important; }

        .be-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:40px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:4px !important;
          font-weight:400 !important;
        }
        .be-title span { color:#60a5fa !important; }

        .be-subtitle {
          font-size:13px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
          margin-bottom:24px !important;
          padding-bottom:20px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .be-search-wrap {
          position:relative !important;
          margin-bottom:24px !important;
        }

        .be-search-icon {
          position:absolute !important;
          left:14px !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          color:rgba(255,255,255,0.2) !important;
          pointer-events:none !important;
        }

        .be-search {
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:12px !important;
          padding:11px 14px 11px 40px !important;
          color:#e2e8f0 !important;
          font-family:'IBM Plex Sans',sans-serif !important;
          font-size:13px !important;
          font-weight:300 !important;
          outline:none !important;
          width:100% !important;
          max-width:400px !important;
          transition:border-color 0.2s !important;
        }
        .be-search:focus { border-color:#3b82f6 !important; }
        .be-search::placeholder { color:rgba(255,255,255,0.18) !important; }

        .be-grid {
          display:grid !important;
          grid-template-columns:repeat(auto-fill,minmax(320px,1fr)) !important;
          gap:16px !important;
        }

        .be-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:16px !important;
          overflow:hidden !important;
          display:flex !important;
          flex-direction:column !important;
          transition:transform 0.18s, border-color 0.18s, box-shadow 0.18s !important;
        }
        .be-card:hover {
          transform:translateY(-3px) !important;
          border-color:rgba(59,130,246,0.3) !important;
          box-shadow:0 8px 28px rgba(0,0,0,0.3) !important;
        }

        .be-card-top {
          padding:22px 20px 18px !important;
          position:relative !important;
          overflow:hidden !important;
          background:linear-gradient(135deg,rgba(59,130,246,0.12) 0%,rgba(99,102,241,0.08) 100%) !important;
          border-bottom:0.5px solid rgba(59,130,246,0.1) !important;
        }

        .be-card-top-glow {
          position:absolute !important;
          top:-30px !important; right:-30px !important;
          width:120px !important; height:120px !important;
          background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .be-event-date {
          font-size:10px !important;
          color:#60a5fa !important;
          font-weight:600 !important;
          letter-spacing:1.2px !important;
          margin-bottom:6px !important;
          position:relative !important;
        }

        .be-event-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:18px !important;
          font-weight:700 !important;
          color:#fff !important;
          line-height:1.2 !important;
          letter-spacing:-0.3px !important;
          position:relative !important;
          margin:0 !important;
        }

        .be-reg-badge {
          background:rgba(74,222,128,0.12) !important;
          color:#4ade80 !important;
          border:0.5px solid rgba(74,222,128,0.3) !important;
          font-size:10px !important;
          font-weight:600 !important;
          padding:3px 10px !important;
          border-radius:100px !important;
          white-space:nowrap !important;
          flex-shrink:0 !important;
          position:relative !important;
        }

        .be-card-body {
          padding:16px 20px !important;
          flex:1 !important;
        }

        .be-desc {
          font-size:12.5px !important;
          color:rgba(255,255,255,0.35) !important;
          margin-bottom:14px !important;
          line-height:1.5 !important;
          font-weight:300 !important;
          display:-webkit-box !important;
          -webkit-line-clamp:2 !important;
          -webkit-box-orient:vertical !important;
          overflow:hidden !important;
        }

        .be-meta-item {
          display:flex !important;
          align-items:center !important;
          gap:8px !important;
          font-size:12px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
          margin-bottom:6px !important;
        }
        .be-meta-item:last-child { margin-bottom:0 !important; }

        .be-progress-wrap {
          margin-top:14px !important;
          height:3px !important;
          background:rgba(255,255,255,0.06) !important;
          border-radius:2px !important;
          overflow:hidden !important;
        }

        .be-card-footer {
          padding:12px 20px !important;
          border-top:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .be-btn-register {
          width:100% !important;
          padding:11px !important;
          background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%) !important;
          border:none !important;
          border-radius:10px !important;
          color:#fff !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          cursor:pointer !important;
          transition:opacity 0.2s,transform 0.15s !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          gap:6px !important;
        }
        .be-btn-register:hover:not(:disabled) { opacity:0.88 !important; transform:translateY(-1px) !important; }
        .be-btn-register:disabled { opacity:0.5 !important; cursor:not-allowed !important; }

        .be-btn-registered {
          width:100% !important;
          padding:11px !important;
          background:rgba(74,222,128,0.08) !important;
          border:0.5px solid rgba(74,222,128,0.25) !important;
          border-radius:10px !important;
          color:#4ade80 !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          cursor:default !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          gap:6px !important;
        }

        .be-btn-full {
          width:100% !important;
          padding:11px !important;
          background:rgba(239,68,68,0.08) !important;
          border:0.5px solid rgba(239,68,68,0.2) !important;
          border-radius:10px !important;
          color:#f87171 !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          cursor:not-allowed !important;
        }
      `}</style>

      <div className="be-wrap fade-in">
        <div className="be-title">Browse <span>Events</span></div>
        <div className="be-subtitle">Discover and register for upcoming campus activities</div>

        <div className="be-search-wrap">
          <div className="be-search-icon"><Search size={15} /></div>
          <input
            className="be-search"
            placeholder="Search events or locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No events found</h3>
            <p>Check back later for upcoming activities</p>
          </div>
        ) : (
          <div className="be-grid">
            {filtered.map(event => {
              const isRegistered = myRegistrations.includes(event.id)
              const regCount = event.registrations?.[0]?.count ?? 0
              const isFull = regCount >= event.capacity
              const pct = Math.min((regCount / event.capacity) * 100, 100)
              return (
                <div key={event.id} className="be-card">
                  <div className="be-card-top">
                    <div className="be-card-top-glow" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <div className="be-event-date">
                          {format(new Date(event.event_date), 'EEEE, MMMM d').toUpperCase()}
                        </div>
                        <div className="be-event-title">{event.title}</div>
                      </div>
                      {isRegistered && <span className="be-reg-badge">✓ Registered</span>}
                    </div>
                  </div>

                  <div className="be-card-body">
                    {event.description && <div className="be-desc">{event.description}</div>}
                    <div className="be-meta-item"><Clock size={12} color="#60a5fa" />{event.event_time}</div>
                    <div className="be-meta-item"><MapPin size={12} color="#60a5fa" />{event.location}</div>
                    <div className="be-meta-item"><Users size={12} color="rgba(255,255,255,0.3)" />{regCount}/{event.capacity} spots filled</div>
                    <div className="be-progress-wrap">
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: isFull ? '#f87171' : 'linear-gradient(90deg,#3b82f6,#6366f1)',
                        borderRadius: 2,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  <div className="be-card-footer">
                    {isRegistered ? (
                      <div className="be-btn-registered">✓ Already Registered</div>
                    ) : isFull ? (
                      <div className="be-btn-full">Event Full</div>
                    ) : (
                      <button className="be-btn-register" onClick={() => handleRegister(event.id)} disabled={registering === event.id}>
                        {registering === event.id ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Register Now →'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Toast toast={toast} />
      </div>
    </>
  )
}