import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, ShieldCheck, User } from 'lucide-react'
import { format } from 'date-fns'

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const admins = filtered.filter(u => u.role === 'admin')
  const regularUsers = filtered.filter(u => u.role !== 'admin')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .au-wrap { font-family:'IBM Plex Sans',sans-serif !important; }

        .au-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:40px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:4px !important;
          font-weight:400 !important;
        }
        .au-title span { color:#60a5fa !important; }

        .au-subtitle {
          font-size:13px !important;
          color:rgba(255,220,255,0.3) !important;
          font-weight:300 !important;
          margin-bottom:24px !important;
          padding-bottom:20px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .au-search-wrap {
          position:relative !important;
          margin-bottom:24px !important;
        }

        .au-search-icon {
          position:absolute !important;
          left:14px !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          color:rgba(255,255,255,0.2) !important;
          pointer-events:none !important;
        }

        .au-search {
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
        .au-search:focus { border-color:#3b82f6 !important; }
        .au-search::placeholder { color:rgba(255,255,255,0.18) !important; }

        .au-section-label {
          font-size:10px !important;
          color:rgba(255,255,255,0.2) !important;
          letter-spacing:1.8px !important;
          text-transform:uppercase !important;
          font-weight:500 !important;
          margin-bottom:10px !important;
          margin-top:20px !important;
          display:flex !important;
          align-items:center !important;
          gap:8px !important;
        }

        .au-section-line {
          flex:1 !important;
          height:0.5px !important;
          background:rgba(255,255,255,0.06) !important;
        }

        .au-grid {
          display:grid !important;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr)) !important;
          gap:12px !important;
        }

        .au-card {
          background:rgba(218, 14, 14, 0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:14px !important;
          padding:16px !important;
          display:flex !important;
          align-items:center !important;
          gap:14px !important;
          transition:transform 0.18s, border-color 0.18s, box-shadow 0.18s !important;
        }
        .au-card:hover {
          transform:translateY(-2px) !important;
          border-color:rgba(132, 0, 255, 0.25) !important;
          box-shadow:0 6px 20px rgba(0,0,0,0.25) !important;
        }

        .au-card.admin {
          background:rgba(59,130,246,0.04) !important;
          border-color:rgba(59,130,246,0.15) !important;
        }
        .au-card.admin:hover { border-color:rgba(59,130,246,0.35) !important; }

        .au-avatar {
          width:44px !important; height:44px !important;
          border-radius:50% !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          flex-shrink:0 !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-weight:700 !important;
          font-size:14px !important;
        }

        .au-avatar-admin {
          background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(99,102,241,0.2)) !important;
          border:1.5px solid rgba(59,130,246,0.35) !important;
          color:#60a5fa !important;
        }

        .au-avatar-user {
          background:rgba(255,255,255,0.05) !important;
          border:1.5px solid rgba(255,255,255,0.1) !important;
          color:rgba(255,255,255,0.5) !important;
        }

        .au-name {
          font-size:13.5px !important;
          font-weight:600 !important;
          color:#fff !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
          white-space:nowrap !important;
          margin:0 !important;
          font-family:'Space Grotesk',sans-serif !important;
        }

        .au-email {
          font-size:11.5px !important;
          color:rgba(255,255,255,0.25) !important;
          overflow:hidden !important;
          text-overflow:ellipsis !important;
          white-space:nowrap !important;
          font-weight:300 !important;
          margin:2px 0 !important;
        }

        .au-joined {
          font-size:10px !important;
          color:rgba(255,255,255,0.18) !important;
          font-weight:300 !important;
        }

        .au-badge-admin {
          background:rgba(59,130,246,0.12) !important;
          color:#60a5fa !important;
          border:0.5px solid rgba(59,130,246,0.25) !important;
          font-size:10px !important;
          font-weight:600 !important;
          padding:3px 10px !important;
          border-radius:100px !important;
          white-space:nowrap !important;
          flex-shrink:0 !important;
          display:flex !important;
          align-items:center !important;
          gap:4px !important;
        }

        .au-badge-user {
          background:rgba(255,255,255,0.05) !important;
          color:rgba(255,255,255,0.3) !important;
          border:0.5px solid rgba(255,255,255,0.08) !important;
          font-size:10px !important;
          font-weight:600 !important;
          padding:3px 10px !important;
          border-radius:100px !important;
          white-space:nowrap !important;
          flex-shrink:0 !important;
          display:flex !important;
          align-items:center !important;
          gap:4px !important;
        }

        .au-count {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:12px !important;
          font-weight:600 !important;
          color:rgba(255,255,255,0.2) !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:100px !important;
          padding:2px 8px !important;
        }
      `}</style>

      <div className="au-wrap fade-in">
        <div className="au-title">All <span>Users</span></div>
        <div className="au-subtitle">All registered accounts on EventHub</div>

        <div className="au-search-wrap">
          <div className="au-search-icon"><Search size={15} /></div>
          <input
            className="au-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        ) : (
          <>
            {/* Admins */}
            {admins.length > 0 && (
              <>
                <div className="au-section-label">
                  <ShieldCheck size={12} color="rgba(96,165,250,0.5)" />
                  Admins
                  <span className="au-count">{admins.length}</span>
                  <div className="au-section-line" />
                </div>
                <div className="au-grid">
                  {admins.map(u => {
                    const initials = u.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
                    return (
                      <div key={u.id} className="au-card admin">
                        <div className={`au-avatar au-avatar-admin`}>{initials}</div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div className="au-name">{u.full_name || '—'}</div>
                          <div className="au-email">{u.email}</div>
                          <div className="au-joined">Joined {format(new Date(u.created_at), 'MMM d, yyyy')}</div>
                        </div>
                        <div className="au-badge-admin"><ShieldCheck size={10} /> Admin</div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Users */}
            {regularUsers.length > 0 && (
              <>
                <div className="au-section-label">
                  <User size={12} color="rgba(255,255,255,0.2)" />
                  Users
                  <span className="au-count">{regularUsers.length}</span>
                  <div className="au-section-line" />
                </div>
                <div className="au-grid">
                  {regularUsers.map(u => {
                    const initials = u.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
                    return (
                      <div key={u.id} className="au-card">
                        <div className="au-avatar au-avatar-user">{initials}</div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div className="au-name">{u.full_name || '—'}</div>
                          <div className="au-email">{u.email}</div>
                          <div className="au-joined">Joined {format(new Date(u.created_at), 'MMM d, yyyy')}</div>
                        </div>
                        <div className="au-badge-user"><User size={10} /> User</div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {filtered.length === 0 && (
              <div className="empty-state">
                <User size={48} />
                <h3>No users found</h3>
                <p>Try a different search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}