import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import QRCode from 'qrcode'
import { Ticket, Calendar, MapPin, Clock, Download, X } from 'lucide-react'
import { format } from 'date-fns'

export function MyTickets() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrUrl, setQrUrl] = useState('')
  const { user, profile } = useAuth()

  useEffect(() => {
    supabase
      .from('registrations')
      .select('*, events(title, event_date, event_time, location, status)')
      .eq('user_id', user.id)
      .order('registered_at', { ascending: false })
      .then(({ data }) => { setRegistrations(data || []); setLoading(false) })
  }, [user.id])

  async function openTicket(reg) {
    setSelectedTicket(reg)
    const url = await QRCode.toDataURL(reg.ticket_code, { width: 260, margin: 2, color: { dark: '#0d0f14', light: '#ffffff' } })
    setQrUrl(url)
  }

  async function downloadTicket() {
    if (!qrUrl || !selectedTicket) return
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `ticket-${selectedTicket.ticket_code.slice(0, 8)}.png`
    a.click()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .mt-wrap { font-family:'IBM Plex Sans',sans-serif !important; }

        .mt-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:40px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:4px !important;
          font-weight:400 !important;
        }
        .mt-title span { color:#60a5fa !important; }

        .mt-subtitle {
          font-size:13px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
          margin-bottom:24px !important;
          padding-bottom:20px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .mt-grid {
          display:grid !important;
          grid-template-columns:repeat(auto-fill,minmax(300px,1fr)) !important;
          gap:16px !important;
        }

        .mt-card {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:16px !important;
          overflow:hidden !important;
          cursor:pointer !important;
          transition:transform 0.18s, border-color 0.18s, box-shadow 0.18s !important;
        }
        .mt-card:hover {
          transform:translateY(-3px) !important;
          border-color:rgba(59,130,246,0.3) !important;
          box-shadow:0 8px 28px rgba(0,0,0,0.3) !important;
        }

        .mt-card-top {
          padding:20px !important;
          position:relative !important;
          overflow:hidden !important;
          background:linear-gradient(135deg,rgba(59,130,246,0.12) 0%,rgba(99,102,241,0.08) 100%) !important;
        }

        .mt-card-top.checked-in {
          background:linear-gradient(135deg,rgba(74,222,128,0.12) 0%,rgba(59,130,246,0.06) 100%) !important;
        }

        .mt-card-glow {
          position:absolute !important;
          top:-30px !important; right:-30px !important;
          width:120px !important; height:120px !important;
          background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .mt-notch-left {
          position:absolute !important;
          bottom:-12px !important; left:-12px !important;
          width:24px !important; height:24px !important;
          border-radius:50% !important;
          background:#080c14 !important;
          z-index:2 !important;
        }

        .mt-notch-right {
          position:absolute !important;
          bottom:-12px !important; right:-12px !important;
          width:24px !important; height:24px !important;
          border-radius:50% !important;
          background:#080c14 !important;
          z-index:2 !important;
        }

        .mt-event-label {
          font-size:10px !important;
          color:#60a5fa !important;
          font-weight:600 !important;
          letter-spacing:1.5px !important;
          margin-bottom:6px !important;
          text-transform:uppercase !important;
          position:relative !important;
        }

        .mt-event-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:16px !important;
          font-weight:700 !important;
          color:#fff !important;
          line-height:1.3 !important;
          letter-spacing:-0.3px !important;
          max-width:220px !important;
          position:relative !important;
          margin:0 !important;
        }

        .mt-badge-registered { background:rgba(59,130,246,0.12) !important; color:#60a5fa !important; border:0.5px solid rgba(59,130,246,0.3) !important; font-size:10px !important; font-weight:600 !important; padding:3px 10px !important; border-radius:100px !important; white-space:nowrap !important; flex-shrink:0 !important; }
        .mt-badge-checked_in { background:rgba(74,222,128,0.12) !important; color:#4ade80 !important; border:0.5px solid rgba(74,222,128,0.3) !important; font-size:10px !important; font-weight:600 !important; padding:3px 10px !important; border-radius:100px !important; white-space:nowrap !important; flex-shrink:0 !important; }
        .mt-badge-cancelled { background:rgba(239,68,68,0.12) !important; color:#f87171 !important; border:0.5px solid rgba(239,68,68,0.3) !important; font-size:10px !important; font-weight:600 !important; padding:3px 10px !important; border-radius:100px !important; white-space:nowrap !important; flex-shrink:0 !important; }

        .mt-card-body {
          padding:16px 20px !important;
          border-top:0.5px dashed rgba(255,255,255,0.07) !important;
        }

        .mt-meta {
          display:flex !important;
          align-items:center !important;
          gap:8px !important;
          font-size:12px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
          margin-bottom:6px !important;
        }
        .mt-meta:last-child { margin-bottom:0 !important; }

        .mt-code-preview {
          margin-top:14px !important;
          background:rgba(255,255,255,0.03) !important;
          border:0.5px solid rgba(255,255,255,0.06) !important;
          border-radius:10px !important;
          padding:10px 14px !important;
          text-align:center !important;
        }

        .mt-code-hint {
          font-size:11px !important;
          color:rgba(255,255,255,0.2) !important;
          font-weight:300 !important;
          margin-bottom:4px !important;
        }

        .mt-code-text {
          font-family:monospace !important;
          font-size:10px !important;
          color:#60a5fa !important;
          letter-spacing:0.5px !important;
        }

        /* Modal */
        .mt-overlay {
          position:fixed !important; inset:0 !important;
          background:rgba(0,0,0,0.75) !important;
          backdrop-filter:blur(6px) !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          z-index:100 !important;
          padding:20px !important;
        }

        .mt-modal {
          background:#0c1120 !important;
          border:0.5px solid rgba(59,130,246,0.15) !important;
          border-radius:20px !important;
          width:100% !important;
          max-width:420px !important;
          overflow:hidden !important;
          box-shadow:0 24px 60px rgba(0,0,0,0.5) !important;
        }

        .mt-modal-header {
          padding:26px 24px 22px !important;
          position:relative !important;
          overflow:hidden !important;
          background:linear-gradient(135deg,rgba(59,130,246,0.15) 0%,rgba(99,102,241,0.1) 100%) !important;
          border-bottom:0.5px solid rgba(59,130,246,0.1) !important;
        }

        .mt-modal-glow {
          position:absolute !important;
          top:-40px !important; right:-40px !important;
          width:160px !important; height:160px !important;
          background:radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .mt-modal-close {
          position:absolute !important;
          top:16px !important; right:16px !important;
          background:rgba(255,255,255,0.08) !important;
          border:0.5px solid rgba(255,255,255,0.1) !important;
          border-radius:8px !important;
          padding:6px !important;
          color:rgba(255,255,255,0.5) !important;
          cursor:pointer !important;
          display:flex !important;
          transition:background 0.15s !important;
          z-index:1 !important;
        }
        .mt-modal-close:hover { background:rgba(255,255,255,0.14) !important; color:#fff !important; }

        .mt-modal-event-label {
          font-size:10px !important;
          color:#60a5fa !important;
          font-weight:600 !important;
          letter-spacing:1.5px !important;
          text-transform:uppercase !important;
          margin-bottom:6px !important;
          position:relative !important;
        }

        .mt-modal-event-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:28px !important;
          color:#fff !important;
          letter-spacing:0.5px !important;
          margin-bottom:14px !important;
          position:relative !important;
          line-height:1 !important;
        }

        .mt-modal-meta {
          display:flex !important;
          gap:16px !important;
          flex-wrap:wrap !important;
          position:relative !important;
        }

        .mt-modal-meta-item {
          display:flex !important;
          align-items:center !important;
          gap:6px !important;
          font-size:12px !important;
          color:rgba(255,255,255,0.6) !important;
          font-weight:300 !important;
        }

        .mt-modal-body {
          padding:24px !important;
          text-align:center !important;
        }

        .mt-user-name {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:16px !important;
          font-weight:700 !important;
          color:#fff !important;
          margin-bottom:2px !important;
        }

        .mt-user-email {
          font-size:12px !important;
          color:rgba(255,255,255,0.25) !important;
          font-weight:300 !important;
          margin-bottom:20px !important;
        }

        .mt-qr-wrap {
          background:#fff !important;
          border-radius:14px !important;
          padding:16px !important;
          display:inline-block !important;
          margin-bottom:14px !important;
          box-shadow:0 0 0 6px rgba(59,130,246,0.1) !important;
        }

        .mt-scan-hint {
          font-size:12px !important;
          color:rgba(255,255,255,0.2) !important;
          font-weight:300 !important;
          margin-bottom:8px !important;
        }

        .mt-ticket-code {
          font-family:monospace !important;
          font-size:10px !important;
          color:rgba(255,255,255,0.15) !important;
          word-break:break-all !important;
          margin-bottom:16px !important;
          padding:0 20px !important;
        }

        .mt-modal-footer {
          padding:0 24px 24px !important;
        }

        .mt-download-btn {
          width:100% !important;
          padding:12px !important;
          background:rgba(59,130,246,0.08) !important;
          border:0.5px solid rgba(59,130,246,0.2) !important;
          border-radius:12px !important;
          color:#60a5fa !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          cursor:pointer !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          gap:8px !important;
          transition:background 0.15s !important;
        }
        .mt-download-btn:hover { background:rgba(59,130,246,0.15) !important; }
      `}</style>

      <div className="mt-wrap fade-in">
        <div className="mt-title">My <span>Tickets</span></div>
        <div className="mt-subtitle">Your registered events and QR tickets</div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : registrations.length === 0 ? (
          <div className="empty-state">
            <Ticket size={48} />
            <h3>No tickets yet</h3>
            <p>Register for an event to get your QR ticket</p>
          </div>
        ) : (
          <div className="mt-grid">
            {registrations.map(reg => (
              <div key={reg.id} className="mt-card" onClick={() => openTicket(reg)}>
                <div className={`mt-card-top${reg.status === 'checked_in' ? ' checked-in' : ''}`}>
                  <div className="mt-card-glow" />
                  <div className="mt-notch-left" />
                  <div className="mt-notch-right" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="mt-event-label">Event Ticket</div>
                      <div className="mt-event-title">{reg.events?.title}</div>
                    </div>
                    <span className={`mt-badge-${reg.status}`}>{reg.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="mt-card-body">
                  <div className="mt-meta"><Calendar size={12} color="#60a5fa" />{format(new Date(reg.events?.event_date), 'MMMM d, yyyy')}</div>
                  <div className="mt-meta"><Clock size={12} color="#60a5fa" />{reg.events?.event_time}</div>
                  <div className="mt-meta"><MapPin size={12} color="#60a5fa" />{reg.events?.location}</div>
                  <div className="mt-code-preview">
                    <div className="mt-code-hint">Tap to view QR Code</div>
                    <div className="mt-code-text">{reg.ticket_code.slice(0, 24)}...</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedTicket && (
          <div className="mt-overlay" onClick={() => { setSelectedTicket(null); setQrUrl('') }}>
            <div className="mt-modal" onClick={e => e.stopPropagation()}>
              <div className="mt-modal-header">
                <div className="mt-modal-glow" />
                <button className="mt-modal-close" onClick={() => { setSelectedTicket(null); setQrUrl('') }}>
                  <X size={15} />
                </button>
                <div className="mt-modal-event-label">Event Ticket</div>
                <div className="mt-modal-event-title">{selectedTicket.events?.title}</div>
                <div className="mt-modal-meta">
                  <div className="mt-modal-meta-item"><Calendar size={12} color="#60a5fa" />{format(new Date(selectedTicket.events?.event_date), 'MMM d, yyyy')}</div>
                  <div className="mt-modal-meta-item"><MapPin size={12} color="#60a5fa" />{selectedTicket.events?.location}</div>
                </div>
              </div>

              <div className="mt-modal-body">
                <div className="mt-user-name">{profile?.full_name}</div>
                <div className="mt-user-email">{profile?.email}</div>

                {qrUrl ? (
                  <div className="mt-qr-wrap">
                    <img src={qrUrl} alt="QR Ticket" style={{ display: 'block', width: 200, height: 200 }} />
                  </div>
                ) : (
                  <div style={{ width: 232, height: 232, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <span className="spinner" style={{ width: 32, height: 32 }} />
                  </div>
                )}

                <div className="mt-scan-hint">Scan at the entrance</div>
                <div className="mt-ticket-code">{selectedTicket.ticket_code}</div>

                <span className={`mt-badge-${selectedTicket.status}`} style={{ fontSize: 12, padding: '5px 14px' }}>
                  {selectedTicket.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="mt-modal-footer">
                <button className="mt-download-btn" onClick={downloadTicket}>
                  <Download size={14} /> Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}