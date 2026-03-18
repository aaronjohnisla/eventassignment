import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { Toast } from '../../components/Toast'
import { Save, ArrowLeft, Calendar, Clock, MapPin, Users, FileText, Info } from 'lucide-react'

const defaultForm = { title: '', description: '', location: '', event_date: '', event_time: '', capacity: 50, status: 'draft' }

export function EventForm() {
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  useEffect(() => {
    if (isEdit) {
      supabase.from('events').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setForm(data)
        setFetching(false)
      })
    }
  }, [id])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, capacity: parseInt(form.capacity) }
    let error
    if (isEdit) {
      ({ error } = await supabase.from('events').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id))
    } else {
      ({ error } = await supabase.from('events').insert({ ...payload, created_by: profile.id }))
    }
    setLoading(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(isEdit ? 'Event updated!' : 'Event created!', 'success')
    setTimeout(() => navigate('/admin/events'), 1000)
  }

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  )

  const statusColors = {
    draft: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' },
    published: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
    completed: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  }
  const sc = statusColors[form.status] || statusColors.draft

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .ef-wrap { font-family:'IBM Plex Sans',sans-serif !important; max-width:860px !important; }

        .ef-back-btn {
          display:inline-flex !important;
          align-items:center !important;
          justify-content:center !important;
          width:36px !important; height:36px !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          color:rgba(255,255,255,0.5) !important;
          cursor:pointer !important;
          transition:all 0.15s !important;
          flex-shrink:0 !important;
        }
        .ef-back-btn:hover { background:rgba(255,255,255,0.08) !important; color:#fff !important; }

        .ef-title {
          font-family:'Bebas Neue',sans-serif !important;
          font-size:36px !important;
          color:#fff !important;
          letter-spacing:1px !important;
          line-height:1 !important;
          margin-bottom:4px !important;
          font-weight:400 !important;
        }
        .ef-title span { color:#60a5fa !important; }

        .ef-subtitle {
          font-size:13px !important;
          color:rgba(255,255,255,0.3) !important;
          font-weight:300 !important;
        }

        .ef-preview {
          background:linear-gradient(135deg,rgba(59,130,246,0.1) 0%,rgba(99,102,241,0.07) 100%) !important;
          border:0.5px solid rgba(59,130,246,0.15) !important;
          border-radius:16px !important;
          padding:20px 24px !important;
          margin-bottom:20px !important;
          position:relative !important;
          overflow:hidden !important;
        }

        .ef-preview-glow {
          position:absolute !important;
          top:-30px !important; right:-30px !important;
          width:150px !important; height:150px !important;
          background:radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%) !important;
          border-radius:50% !important;
          pointer-events:none !important;
        }

        .ef-preview-label {
          font-size:10px !important;
          color:rgba(255,255,255,0.25) !important;
          letter-spacing:1.5px !important;
          text-transform:uppercase !important;
          font-weight:500 !important;
          margin-bottom:6px !important;
          position:relative !important;
        }

        .ef-preview-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:20px !important;
          font-weight:700 !important;
          color:#fff !important;
          letter-spacing:-0.3px !important;
          margin-bottom:10px !important;
          position:relative !important;
        }

        .ef-preview-meta {
          display:flex !important;
          gap:16px !important;
          flex-wrap:wrap !important;
          position:relative !important;
        }

        .ef-preview-meta-item {
          display:flex !important;
          align-items:center !important;
          gap:6px !important;
          font-size:12px !important;
          color:rgba(255,255,255,0.35) !important;
          font-weight:300 !important;
        }

        .ef-section {
          background:rgba(255,255,255,0.02) !important;
          border:0.5px solid rgba(255,255,255,0.07) !important;
          border-radius:16px !important;
          padding:22px 24px !important;
          margin-bottom:16px !important;
        }

        .ef-section-header {
          display:flex !important;
          align-items:center !important;
          gap:10px !important;
          margin-bottom:20px !important;
          padding-bottom:14px !important;
          border-bottom:0.5px solid rgba(255,255,255,0.06) !important;
        }

        .ef-section-icon {
          width:30px !important; height:30px !important;
          border-radius:8px !important;
          background:rgba(59,130,246,0.1) !important;
          border:0.5px solid rgba(59,130,246,0.2) !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          color:#60a5fa !important;
          flex-shrink:0 !important;
        }

        .ef-section-title {
          font-family:'Space Grotesk',sans-serif !important;
          font-size:14px !important;
          font-weight:600 !important;
          color:#fff !important;
          margin:0 !important;
        }

        .ef-label {
          display:block !important;
          font-size:10px !important;
          color:rgba(255,255,255,0.3) !important;
          letter-spacing:1.8px !important;
          text-transform:uppercase !important;
          font-weight:500 !important;
          margin-bottom:7px !important;
        }

        .ef-input {
          width:100% !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          padding:11px 14px !important;
          color:#e2e8f0 !important;
          font-family:'IBM Plex Sans',sans-serif !important;
          font-size:13px !important;
          font-weight:300 !important;
          outline:none !important;
          transition:border-color 0.2s, background 0.2s !important;
        }
        .ef-input:focus { border-color:#3b82f6 !important; background:rgba(59,130,246,0.04) !important; }
        .ef-input::placeholder { color:rgba(255,255,255,0.15) !important; }

        .ef-select {
          width:100% !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          padding:11px 14px !important;
          color:#e2e8f0 !important;
          font-family:'IBM Plex Sans',sans-serif !important;
          font-size:13px !important;
          font-weight:300 !important;
          outline:none !important;
          transition:border-color 0.2s !important;
          cursor:pointer !important;
        }
        .ef-select:focus { border-color:#3b82f6 !important; }
        .ef-select option { background:#0c1120 !important; }

        .ef-textarea {
          width:100% !important;
          background:rgba(255,255,255,0.04) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:10px !important;
          padding:12px 14px !important;
          color:#e2e8f0 !important;
          font-family:'IBM Plex Sans',sans-serif !important;
          font-size:13px !important;
          font-weight:300 !important;
          outline:none !important;
          resize:vertical !important;
          line-height:1.6 !important;
          transition:border-color 0.2s, background 0.2s !important;
        }
        .ef-textarea:focus { border-color:#3b82f6 !important; background:rgba(59,130,246,0.04) !important; }
        .ef-textarea::placeholder { color:rgba(255,255,255,0.15) !important; }

        .ef-grid-3 { display:grid !important; grid-template-columns:1fr 200px 160px !important; gap:14px !important; margin-bottom:14px !important; }
        .ef-grid-3b { display:grid !important; grid-template-columns:1fr 160px 200px !important; gap:14px !important; }

        .ef-btn-submit {
          display:inline-flex !important;
          align-items:center !important;
          gap:8px !important;
          padding:12px 24px !important;
          background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%) !important;
          border:none !important;
          border-radius:12px !important;
          color:#fff !important;
          font-family:'Space Grotesk',sans-serif !important;
          font-size:14px !important;
          font-weight:600 !important;
          cursor:pointer !important;
          transition:opacity 0.2s, transform 0.15s !important;
        }
        .ef-btn-submit:hover:not(:disabled) { opacity:0.88 !important; transform:translateY(-1px) !important; }
        .ef-btn-submit:disabled { opacity:0.6 !important; cursor:not-allowed !important; }

        .ef-btn-cancel {
          display:inline-flex !important;
          align-items:center !important;
          gap:8px !important;
          padding:12px 20px !important;
          background:rgba(255,255,255,0.03) !important;
          border:0.5px solid rgba(255,255,255,0.09) !important;
          border-radius:12px !important;
          color:rgba(255,255,255,0.4) !important;
          font-family:'IBM Plex Sans',sans-serif !important;
          font-size:14px !important;
          font-weight:400 !important;
          cursor:pointer !important;
          transition:all 0.15s !important;
        }
        .ef-btn-cancel:hover { background:rgba(255,255,255,0.07) !important; color:#fff !important; }
      `}</style>

      <div className="ef-wrap fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button onClick={() => navigate('/admin/events')} className="ef-back-btn"><ArrowLeft size={16} /></button>
          <div>
            <div className="ef-title">{isEdit ? 'Edit' : 'Create'} <span>{isEdit ? 'Event' : 'New Event'}</span></div>
            <div className="ef-subtitle">Fill in the details to publish a new activity for students.</div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="ef-preview">
          <div className="ef-preview-glow" />
          <div className="ef-preview-label">Live Preview</div>
          <div className="ef-preview-title">{form.title || 'Event Title'}</div>
          <div className="ef-preview-meta">
            {form.event_date && <div className="ef-preview-meta-item"><Calendar size={11} color="#60a5fa" />{form.event_date}</div>}
            {form.event_time && <div className="ef-preview-meta-item"><Clock size={11} color="#60a5fa" />{form.event_time}</div>}
            {form.location && <div className="ef-preview-meta-item"><MapPin size={11} color="#60a5fa" />{form.location}</div>}
            {form.capacity && <div className="ef-preview-meta-item"><Users size={11} color="#60a5fa" />{form.capacity} spots</div>}
            <div className="ef-preview-meta-item">
              <span style={{ background: sc.bg, color: sc.color, border: `0.5px solid ${sc.border}`, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100 }}>
                {form.status}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Info */}
          <div className="ef-section">
            <div className="ef-section-header">
              <div className="ef-section-icon"><Info size={14} /></div>
              <div className="ef-section-title">General Information</div>
            </div>
            <div className="ef-grid-3">
              <div>
                <label className="ef-label">Title *</label>
                <input className="ef-input" name="title" placeholder="Event title" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <label className="ef-label">Date *</label>
                <input className="ef-input" type="date" name="event_date" value={form.event_date} onChange={handleChange} required />
              </div>
              <div>
                <label className="ef-label">Time *</label>
                <input className="ef-input" type="time" name="event_time" value={form.event_time} onChange={handleChange} required />
              </div>
            </div>
            <div className="ef-grid-3b">
              <div>
                <label className="ef-label">Location *</label>
                <input className="ef-input" name="location" placeholder="e.g. Computer Laboratory 1" value={form.location} onChange={handleChange} required />
              </div>
              <div>
                <label className="ef-label">Capacity *</label>
                <input className="ef-input" type="number" name="capacity" min="1" value={form.capacity} onChange={handleChange} required />
              </div>
              <div>
                <label className="ef-label">Status</label>
                <select className="ef-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="ef-section">
            <div className="ef-section-header">
              <div className="ef-section-icon"><FileText size={14} /></div>
              <div className="ef-section-title">Description</div>
            </div>
            <textarea
              className="ef-textarea"
              name="description"
              placeholder="Describe the event — what to expect, who should attend, what to bring..."
              value={form.description}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" className="ef-btn-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><Save size={15} /> {isEdit ? 'Update Event' : 'Create Event'}</>}
            </button>
            <button type="button" className="ef-btn-cancel" onClick={() => navigate('/admin/events')}>Cancel</button>
            {form.title && (
              <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>
                Changes preview in real time ↑
              </div>
            )}
          </div>
        </form>
        <Toast toast={toast} />
      </div>
    </>
  )
}