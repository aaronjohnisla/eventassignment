import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { QrCode, CheckCircle, XCircle, Camera, Keyboard } from 'lucide-react'

export function CheckInDesk() {
  const [searchParams] = useSearchParams()
  const eventIdParam = searchParams.get('event')
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(eventIdParam || '')
  const [mode, setMode] = useState('manual')
  const [manualCode, setManualCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    supabase.from('events').select('id, title, event_date').eq('status', 'published').order('event_date')
      .then(({ data }) => setEvents(data || []))
  }, [])

  async function processTicket(code) {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    const { data, error } = await supabase.rpc('checkin_by_ticket', { p_ticket_code: code.trim() })
    setLoading(false)
    if (error) { setResult({ success: false, message: error.message }); return }
    setResult(data)
    if (data.success) setManualCode('')
  }

  async function startScanner() {
    setScannerActive(true)
    try {
      const QrScanner = (await import('qr-scanner')).default
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        scannerRef.current = new QrScanner(videoRef.current, result => {
          processTicket(result.data)
          scannerRef.current?.stop()
          setScannerActive(false)
          stream.getTracks().forEach(t => t.stop())
        }, { returnDetailedScanResult: true })
        scannerRef.current.start()
      }
    } catch (err) {
      setResult({ success: false, message: 'Camera not available. Use manual entry.' })
      setScannerActive(false)
    }
  }

  function stopScanner() {
    scannerRef.current?.stop()
    scannerRef.current = null
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setScannerActive(false)
  }

  function switchMode(m) {
    if (scannerActive) stopScanner()
    setMode(m)
    setResult(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .ci-wrap { font-family: 'IBM Plex Sans', sans-serif !important; max-width: 680px !important; }

        .ci-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 26px !important;
          font-weight: 700 !important;
          color: #fff !important;
          letter-spacing: -0.5px !important;
          margin-bottom: 4px !important;
        }

        .ci-subtitle {
          font-size: 13px !important;
          color: rgba(255,255,255,0.35) !important;
          font-weight: 300 !important;
          margin-bottom: 28px !important;
          padding-bottom: 24px !important;
          border-bottom: 0.5px solid rgba(255,255,255,0.06) !important;
        }

        .ci-card {
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          border-radius: 14px !important;
          padding: 20px !important;
          margin-bottom: 16px !important;
        }

        .ci-label {
          display: block !important;
          font-size: 10px !important;
          color: rgba(255,255,255,0.3) !important;
          letter-spacing: 1.8px !important;
          text-transform: uppercase !important;
          font-weight: 500 !important;
          margin-bottom: 8px !important;
        }

        .ci-select {
          width: 100% !important;
          background: rgba(255,255,255,0.04) !important;
          border: 0.5px solid rgba(255,255,255,0.09) !important;
          border-radius: 10px !important;
          padding: 11px 14px !important;
          color: #e2e8f0 !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          font-size: 13px !important;
          outline: none !important;
          transition: border-color 0.2s !important;
        }
        .ci-select:focus { border-color: #3b82f6 !important; }
        .ci-select option { background: #0c1120 !important; }

        .ci-tabs {
          display: flex !important;
          gap: 6px !important;
          margin-bottom: 16px !important;
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          border-radius: 12px !important;
          padding: 5px !important;
        }

        .ci-tab {
          flex: 1 !important;
          padding: 10px !important;
          border: none !important;
          border-radius: 9px !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: all 0.2s !important;
          background: transparent !important;
          color: rgba(255,255,255,0.35) !important;
        }

        .ci-tab.active {
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          color: #fff !important;
        }

        .ci-card-title {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #fff !important;
          margin-bottom: 14px !important;
        }

        .ci-input-row { display: flex !important; gap: 10px !important; }

        .ci-input {
          flex: 1 !important;
          background: rgba(255,255,255,0.04) !important;
          border: 0.5px solid rgba(255,255,255,0.09) !important;
          border-radius: 10px !important;
          padding: 11px 14px !important;
          color: #e2e8f0 !important;
          font-family: monospace !important;
          font-size: 13px !important;
          outline: none !important;
          transition: border-color 0.2s !important;
        }
        .ci-input:focus { border-color: #3b82f6 !important; }
        .ci-input::placeholder { color: rgba(255,255,255,0.18) !important; }

        .ci-btn-checkin {
          padding: 11px 20px !important;
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #fff !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: opacity 0.2s !important;
          white-space: nowrap !important;
        }
        .ci-btn-checkin:hover:not(:disabled) { opacity: 0.88 !important; }
        .ci-btn-checkin:disabled { opacity: 0.5 !important; cursor: not-allowed !important; }

        .ci-hint {
          font-size: 11px !important;
          color: rgba(255,255,255,0.2) !important;
          margin-top: 8px !important;
          font-weight: 300 !important;
        }

        .ci-camera-box {
          position: relative !important;
          background: #000 !important;
          border-radius: 10px !important;
          overflow: hidden !important;
          aspect-ratio: 4/3 !important;
          margin-bottom: 14px !important;
        }

        .ci-btn-camera {
          width: 100% !important;
          padding: 12px !important;
          border: none !important;
          border-radius: 10px !important;
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: opacity 0.2s !important;
        }

        .ci-btn-start {
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          color: #fff !important;
        }

        .ci-btn-stop {
          background: rgba(239,68,68,0.15) !important;
          border: 0.5px solid rgba(239,68,68,0.3) !important;
          color: #f87171 !important;
        }

        .ci-result {
          padding: 18px 20px !important;
          border-radius: 12px !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 14px !important;
          margin-bottom: 16px !important;
        }

        .ci-result-success {
          background: rgba(74,222,128,0.08) !important;
          border: 0.5px solid rgba(74,222,128,0.25) !important;
        }

        .ci-result-fail {
          background: rgba(239,68,68,0.08) !important;
          border: 0.5px solid rgba(239,68,68,0.25) !important;
        }

        .ci-result-heading {
          font-family: 'Space Grotesk', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          margin-bottom: 4px !important;
        }

        .ci-result-msg {
          font-size: 13px !important;
          color: rgba(255,255,255,0.4) !important;
          font-weight: 300 !important;
        }

        .ci-result-name {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #fff !important;
          margin-top: 10px !important;
        }

        .ci-result-detail {
          font-size: 12px !important;
          color: rgba(255,255,255,0.3) !important;
          font-weight: 300 !important;
        }
      `}</style>

      <div className="ci-wrap fade-in">
        <div className="ci-title">Check-In Desk</div>
        <div className="ci-subtitle">Scan QR tickets or enter codes manually to check in attendees</div>

        {/* Event selector */}
        <div className="ci-card">
          <label className="ci-label">Select Event (optional filter)</label>
          <select className="ci-select" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
            <option value="">All Events</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title} — {e.event_date}</option>)}
          </select>
        </div>

        {/* Mode tabs */}
        <div className="ci-tabs">
          {[
            { key: 'manual', icon: Keyboard, label: 'Manual Entry' },
            { key: 'camera', icon: Camera, label: 'QR Scanner' },
          ].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => switchMode(key)} className={`ci-tab${mode === key ? ' active' : ''}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Manual mode */}
        {mode === 'manual' && (
          <div className="ci-card">
            <div className="ci-card-title">Enter Ticket Code</div>
            <div className="ci-input-row">
              <input
                className="ci-input"
                placeholder="Paste ticket code here..."
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && processTicket(manualCode)}
                autoFocus
              />
              <button className="ci-btn-checkin" onClick={() => processTicket(manualCode)} disabled={loading || !manualCode.trim()}>
                {loading ? <span className="spinner" /> : 'Check In'}
              </button>
            </div>
            <div className="ci-hint">Press Enter or click "Check In" to validate the ticket</div>
          </div>
        )}

        {/* Camera mode */}
        {mode === 'camera' && (
          <div className="ci-card" style={{ textAlign: 'center' }}>
            <div className="ci-camera-box">
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
              {!scannerActive && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                  <QrCode size={48} color="rgba(255,255,255,0.2)" />
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 300 }}>Camera inactive</p>
                </div>
              )}
              {scannerActive && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 200, height: 200, border: '2px solid #3b82f6', borderRadius: 12, boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }} />
                </div>
              )}
            </div>
            {!scannerActive ? (
              <button className="ci-btn-camera ci-btn-start" onClick={startScanner}>
                <Camera size={16} /> Start Camera Scanner
              </button>
            ) : (
              <button className="ci-btn-camera ci-btn-stop" onClick={stopScanner}>
                Stop Scanner
              </button>
            )}
            <div className="ci-hint" style={{ marginTop: 10 }}>Point the camera at a QR code ticket</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`ci-result ${result.success ? 'ci-result-success' : 'ci-result-fail'} fade-in`}>
            {result.success
              ? <CheckCircle size={26} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
              : <XCircle size={26} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />
            }
            <div>
              <div className="ci-result-heading" style={{ color: result.success ? '#4ade80' : '#f87171' }}>
                {result.success ? 'Check-In Successful!' : 'Check-In Failed'}
              </div>
              <div className="ci-result-msg">{result.message}</div>
              {result.success && result.full_name && (
                <>
                  <div className="ci-result-name">{result.full_name}</div>
                  <div className="ci-result-detail">{result.email}</div>
                  <div className="ci-result-detail">📅 {result.event_title}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}