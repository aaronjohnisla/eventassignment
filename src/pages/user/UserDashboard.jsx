import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Calendar, Ticket, CheckCircle, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export function UserDashboard() {
  const { profile } = useAuth()
  const [regs, setRegs] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    Promise.all([
      supabase.from('registrations').select('*, events(title, event_date, event_time, location)').eq('user_id', profile.id).order('registered_at', { ascending: false }).limit(5),
      supabase.from('events').select('*').eq('status', 'published').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date').limit(4),
    ]).then(([{ data: r }, { data: e }]) => {
      setRegs(r || [])
      setUpcomingEvents(e || [])
      setLoading(false)
    })
  }, [profile])

  const checkedIn = regs.filter(r => r.status === 'checked_in').length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .ud-wrap { font-family:'IBM Plex Sans',sans-serif !important; }

        .ud-hero {
          background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 100%) !important;
          border: 0.5px solid rgba(59,130,246,0.15) !important;
          border-radius: 18px !important;
          padding: 28px 32px !important;
          margin-bottom: 24px !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .ud-hero-glow {
          position: absolute !important;
          top: -40px !important; right: -40px !important;
          width: 200px !important; height: 200px !important;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%) !important;
          border-radius: 50% !important;
          pointer-events: none !important;
        }

        .ud-greeting {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:46px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:6px !important;
          font-weight:400 !important;
          position: relative !important;
        }
        .ud-greeting span { color:#60a5fa !important; }

        .ud-subtext {
          font-size:13px !important;
          color:rgba(255,255,255,0.35) !important;
          font-weight:300 !important;
          position: relative !important;
          margin-bottom: 20px !important;
        }

        .ud-hero-browse {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 9px 16px !important;
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #fff !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          transition: opacity 0.2s, transform 0.15s !important;
          position: relative !important;
        }
        .ud-hero-browse:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }

        .ud-stats {
          display:grid !important;
          grid-template-columns:repeat(3,1fr) !important;
          gap:12px !important;
          margin-bottom:20px !important;
        }

        .ud-stat-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:14px !important;
          padding:18px 20px !important;
          transition: transform 0.18s, border-color 0.2s, box-shadow 0.18s !important;
          cursor: default !important;
        }
        .ud-stat-card:hover {
          transform: translateY(-2px) !important;
          border-color:rgba(59,130,246,0.3) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
        }

        .ud-stat-top {
          display:flex !important;
          align-items:center !important;
          gap:10px !important;
          margin-bottom:12px !important;
        }

        .ud-stat-icon {
          width:34px !important; height:34px !important;
          border-radius:9px !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          flex-shrink:0 !important;
        }

        .ud-stat-label {
          font-size:11px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
          line-height:1.3 !important;
        }

        .ud-stat-value {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:38px !important;
          font-weight:700 !important;
          color:#fff !important;
          letter-spacing:-2px !important;
          line-height:1 !important;
        }

        .ud-grid {
          display:grid !important;
          grid-template-columns:1fr 1fr !important;
          gap:16px !important;
        }

        .ud-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:14px !important;
          padding:18px 20px !important;
          transition: border-color 0.2s !important;
        }
        .ud-card:hover { border-color: rgba(59,130,246,0.15) !important; }

        .ud-card-header {
          display:flex !important;
          justify-content:space-between !important;
          align-items:center !important;
          margin-bottom:14px !important;
          padding-bottom:12px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .ud-card-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          color:#fff !important;
          letter-spacing:-0.2px !important;
          margin:0 !important;
        }

        .ud-card-link {
          font-size:11px !important;
          color:#60a5fa !important;
          text-decoration:none !important;
          font-weight:500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          transition: gap 0.15s !important;
        }
        .ud-card-link:hover { gap: 6px !important; }

        .ud-item {
          display:flex !important;
          align-items:center !important;
          gap:12px !important;
          padding:10px 12px !important;
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.04) !important;
          border-radius:10px !important;
          margin-bottom:7px !important;
          transition: transform 0.15s, border-color 0.2s, background 0.2s !important;
        }
        .ud-item:last-child { margin-bottom:0 !important; }
        .ud-item:hover {
          transform: translateX(3px) !important;
          border-color:rgba(59,130,246,0.2) !important;
          background: rgba(59,130,246,0.03) !important;
        }

        .ud-item-title {
          font-size:12.5px !important;
          font-weight:500 !important;
          color:rgba(255,255,255,0.85) !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
          white-space:nowrap !important;
          margin:0 !important;
        }

        .ud-item-sub {
          font-size:11px !important;
          color:rgba(255,255,255,0.22) !important;
          font-weight:300 !important;
          margin:0 !important;
        }

        .ud-date-block {
          text-align:center !important;
          min-width:36px !important;
          flex-shrink:0 !important;
          background: rgba(59,130,246,0.08) !important;
          border: 0.5px solid rgba(59,130,246,0.15) !important;
          border-radius: 8px !important;
          padding: 4px 6px !important;
        }

        .ud-date-month {
          font-size:8px !important;
          color:#60a5fa !important;
          font-weight:600 !important;
          letter-spacing:1px !important;
          text-transform:uppercase !important;
        }

        .ud-date-day {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:18px !important;
          font-weight:700 !important;
          color:#fff !important;
          line-height:1 !important;
        }

        .ud-badge {
          font-size:10px !important;
          font-weight:500 !important;
          padding:3px 8px !important;
          border-radius:100px !important;
          white-space:nowrap !important;
          flex-shrink:0 !important;
        }
        .ud-badge-registered { background:rgba(59,130,246,0.12) !important; color:#60a5fa !important; border:0.5px solid rgba(59,130,246,0.25) !important; }
        .ud-badge-checked_in { background:rgba(74,222,128,0.12) !important; color:#4ade80 !important; border:0.5px solid rgba(74,222,128,0.25) !important; }
        .ud-badge-cancelled { background:rgba(239,68,68,0.12) !important; color:#f87171 !important; border:0.5px solid rgba(239,68,68,0.25) !important; }

        .ud-empty {
          font-size:12px !important;
          color:rgba(255,255,255,0.15) !important;
          text-align:center !important;
          padding:20px 0 !important;
          font-weight:300 !important;
        }
      `}</style>

      <div className="ud-wrap">

        {/* Hero */}
        <div className="ud-hero">
          <div className="ud-hero-glow" />
          <div className="ud-greeting">
            Good to see you, <span>{profile?.full_name?.split(' ')[0]}</span> ✨
          </div>
          <div className="ud-subtext">Your campus events are waiting — let's get you in!</div>
          <Link to="/events" className="ud-hero-browse">
            Browse Events <ArrowRight size={13} />
          </Link>
        </div>

        {/* Stats */}
        <div className="ud-stats">
          <div className="ud-stat-card">
            <div className="ud-stat-top">
              <div className="ud-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', border: '0.5px solid rgba(245,158,11,0.2)' }}>
                <Ticket size={15} color="#f59e0b" />
              </div>
              <div className="ud-stat-label">Events Registered</div>
            </div>
            <div className="ud-stat-value">{loading ? '—' : regs.length}</div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-top">
              <div className="ud-stat-icon" style={{ background: 'rgba(74,222,128,0.12)', border: '0.5px solid rgba(74,222,128,0.2)' }}>
                <CheckCircle size={15} color="#4ade80" />
              </div>
              <div className="ud-stat-label">Checked In</div>
            </div>
            <div className="ud-stat-value">{loading ? '—' : checkedIn}</div>
          </div>

          <div className="ud-stat-card">
            <div className="ud-stat-top">
              <div className="ud-stat-icon" style={{ background: 'rgba(59,130,246,0.12)', border: '0.5px solid rgba(59,130,246,0.2)' }}>
                <Calendar size={15} color="#60a5fa" />
              </div>
              <div className="ud-stat-label">Upcoming Events</div>
            </div>
            <div className="ud-stat-value">{loading ? '—' : upcomingEvents.length}</div>
          </div>
        </div>

        {/* Cards */}
        <div className="ud-grid">
          <div className="ud-card">
            <div className="ud-card-header">
              <div className="ud-card-title">My Tickets</div>
              <Link to="/my-tickets" className="ud-card-link">View all <ArrowRight size={11} /></Link>
            </div>
            {regs.slice(0, 4).map(r => (
              <div key={r.id} className="ud-item">
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="ud-item-title">{r.events?.title}</div>
                  <div className="ud-item-sub">{r.events?.event_date}</div>
                </div>
                <span className={`ud-badge ud-badge-${r.status}`}>{r.status.replace('_', ' ')}</span>
              </div>
            ))}
            {!loading && regs.length === 0 && <div className="ud-empty">No tickets yet</div>}
          </div>

          <div className="ud-card">
            <div className="ud-card-header">
              <div className="ud-card-title">Upcoming Events</div>
              <Link to="/events" className="ud-card-link">Browse all <ArrowRight size={11} /></Link>
            </div>
            {upcomingEvents.map(e => (
              <div key={e.id} className="ud-item">
                <div className="ud-date-block">
                  <div className="ud-date-month">{format(new Date(e.event_date), 'MMM')}</div>
                  <div className="ud-date-day">{format(new Date(e.event_date), 'd')}</div>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="ud-item-title">{e.title}</div>
                  <div className="ud-item-sub">{e.location}</div>
                </div>
              </div>
            ))}
            {!loading && upcomingEvents.length === 0 && <div className="ud-empty">No upcoming events</div>}
          </div>
        </div>
      </div>
    </>
  )
}