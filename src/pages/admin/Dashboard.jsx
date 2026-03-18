import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Calendar, Users, Ticket, TrendingUp, Plus } from 'lucide-react'
import { format } from 'date-fns'

export function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, users: 0, registrations: 0, checkins: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [{ count: events }, { count: users }, { count: regs }, { count: checkins }, { data: evts }] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'checked_in'),
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ events: events || 0, users: users || 0, registrations: regs || 0, checkins: checkins || 0 })
      setRecentEvents(evts || [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Events', value: stats.events, icon: Calendar, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
    { label: 'Registered Users', value: stats.users, icon: Users, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)' },
    { label: 'Total Registrations', value: stats.registrations, icon: Ticket, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' },
    { label: 'Checked In', value: stats.checkins, icon: TrendingUp, color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.2)' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .ad-wrap { font-family: 'IBM Plex Sans', sans-serif !important; }

        .ad-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 26px !important;
          font-weight: 700 !important;
          color: #fff !important;
          letter-spacing: -0.5px !important;
          margin-bottom: 4px !important;
        }

        .ad-subtitle {
          font-size: 13px !important;
          color: rgba(255,255,255,0.35) !important;
          font-weight: 300 !important;
        }

        .ad-create-btn {
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
        .ad-create-btn:hover { opacity: 0.88 !important; transform: translateY(-1px) !important; }

        .ad-stat-card {
          padding: 20px !important;
          border-radius: 14px !important;
          background: rgba(255,255,255,0.03) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          transition: transform 0.18s, border-color 0.18s, box-shadow 0.18s !important;
          cursor: default !important;
        }
        .ad-stat-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
        }

        .ad-stat-icon {
          width: 40px !important; height: 40px !important;
          border-radius: 10px !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
        }

        .ad-stat-label {
          font-size: 12px !important;
          color: rgba(255,255,255,0.35) !important;
          font-weight: 300 !important;
        }

        .ad-stat-value {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 34px !important;
          font-weight: 700 !important;
          color: #fff !important;
          letter-spacing: -1px !important;
          margin-top: 10px !important;
        }

        .ad-recent-card {
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          border-radius: 14px !important;
          padding: 20px !important;
        }

        .ad-recent-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          color: #fff !important;
          margin: 0 !important;
        }

        .ad-view-all {
          font-size: 12px !important;
          color: #60a5fa !important;
          text-decoration: none !important;
          font-weight: 500 !important;
        }

        .ad-event-row {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
          padding: 12px 14px !important;
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.05) !important;
          border-radius: 10px !important;
          transition: transform 0.18s, border-color 0.18s, background 0.18s !important;
          cursor: default !important;
        }
        .ad-event-row:hover {
          transform: translateX(4px) !important;
          border-color: rgba(59,130,246,0.25) !important;
          background: rgba(59,130,246,0.04) !important;
        }

        .ad-event-month {
          font-size: 10px !important;
          color: #60a5fa !important;
          font-weight: 600 !important;
          letter-spacing: 1px !important;
        }

        .ad-event-day {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 20px !important;
          font-weight: 700 !important;
          color: #fff !important;
          line-height: 1.1 !important;
        }

        .ad-event-title {
          font-size: 13px !important;
          font-weight: 500 !important;
          color: rgba(255,255,255,0.85) !important;
          margin: 0 !important;
        }

        .ad-event-sub {
          font-size: 11px !important;
          color: rgba(255,255,255,0.25) !important;
          font-weight: 300 !important;
          margin: 0 !important;
        }

        .ad-badge {
          font-size: 10px !important;
          font-weight: 500 !important;
          padding: 3px 10px !important;
          border-radius: 100px !important;
          white-space: nowrap !important;
        }
        .ad-badge-published { background: rgba(74,222,128,0.12) !important; color: #4ade80 !important; border: 0.5px solid rgba(74,222,128,0.25) !important; }
        .ad-badge-draft { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.4) !important; border: 0.5px solid rgba(255,255,255,0.1) !important; }
        .ad-badge-cancelled { background: rgba(239,68,68,0.12) !important; color: #f87171 !important; border: 0.5px solid rgba(239,68,68,0.25) !important; }
        .ad-badge-completed { background: rgba(59,130,246,0.12) !important; color: #60a5fa !important; border: 0.5px solid rgba(59,130,246,0.25) !important; }
      `}</style>

      <div className="ad-wrap fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="ad-title">Dashboard</div>
            <div className="ad-subtitle">Overview of campus event activity</div>
          </div>
          <Link to="/admin/events/create" className="ad-create-btn">
            <Plus size={15} /> Create Event
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className="ad-stat-card" style={{ borderColor: border }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <div className="ad-stat-icon" style={{ background: bg }}>
                  <Icon size={18} color={color} />
                </div>
                <span className="ad-stat-label">{label}</span>
              </div>
              <div className="ad-stat-value">
                {loading ? <span className="spinner" style={{ width: 24, height: 24 }} /> : value}
              </div>
            </div>
          ))}
        </div>

        <div className="ad-recent-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div className="ad-recent-title">Recent Events</div>
            <Link to="/admin/events" className="ad-view-all">View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentEvents.map(event => (
              <div key={event.id} className="ad-event-row">
                <div style={{ textAlign: 'center', minWidth: 44 }}>
                  <div className="ad-event-month">{format(new Date(event.event_date), 'MMM').toUpperCase()}</div>
                  <div className="ad-event-day">{format(new Date(event.event_date), 'd')}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="ad-event-title">{event.title}</div>
                  <div className="ad-event-sub">{event.location} · {event.event_time}</div>
                </div>
                <span className={`ad-badge ad-badge-${event.status}`}>{event.status}</span>
              </div>
            ))}
            {!loading && recentEvents.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: 20, fontSize: 13 }}>No events yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}