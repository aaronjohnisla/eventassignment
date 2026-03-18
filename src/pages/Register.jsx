import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, Mail, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react'

export function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', role: 'user', adminCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const ADMIN_CODE = 'EVENTHUB2024'

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.role === 'admin' && form.adminCode !== ADMIN_CODE) { setError('Invalid admin access code'); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName, form.role)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .rg-wrap { min-height:100vh !important; display:flex !important; font-family:'IBM Plex Sans',sans-serif !important; background:#080c14 !important; flex-direction:row !important; }

        .rg-left { flex:1 !important; background:#080c14 !important; padding:44px 50px !important; display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; position:relative !important; overflow:hidden !important; }

        .rg-glow1 { position:absolute !important; top:-100px !important; left:-100px !important; width:350px !important; height:350px !important; background:radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .rg-glow2 { position:absolute !important; bottom:-80px !important; right:20px !important; width:260px !important; height:260px !important; background:radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }

        .rg-inner { width:100% !important; max-width:480px !important; position:relative !important; }

        .rg-logo { display:flex !important; align-items:center !important; gap:11px !important; margin-bottom:36px !important; }
        .rg-logo-icon { width:40px !important; height:40px !important; background:linear-gradient(135deg,#3b82f6,#6366f1) !important; border-radius:11px !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; }
        .rg-logo-name { font-family:'Space Grotesk',sans-serif !important; font-weight:700 !important; font-size:18px !important; color:#fff !important; letter-spacing:-0.4px !important; margin:0 !important; }
        .rg-logo-inst { font-size:10px !important; color:rgba(255,255,255,0.3) !important; letter-spacing:2px !important; text-transform:uppercase !important; font-weight:400 !important; margin:0 !important; }

        .rg-heading { font-family:'Bebas Neue',sans-serif !important; font-size:44px !important; color:#fff !important; letter-spacing:1px !important; line-height:0.95 !important; margin-bottom:8px !important; font-weight:400 !important; }
        .rg-heading span { color:#3b82f6 !important; }
        .rg-subtext { font-size:13px !important; color:rgba(255,255,255,0.35) !important; font-weight:300 !important; margin-bottom:28px !important; }

        .rg-label { display:block !important; font-size:10px !important; color:rgba(255,255,255,0.3) !important; letter-spacing:1.8px !important; text-transform:uppercase !important; font-weight:500 !important; margin-bottom:7px !important; }

        .rg-input-box { display:flex !important; align-items:center !important; background:rgba(255,255,255,0.04) !important; border:0.5px solid rgba(255,255,255,0.09) !important; border-radius:12px !important; transition:border-color 0.2s,background 0.2s !important; padding:0 !important; margin-bottom:14px !important; }
        .rg-input-box:focus-within { border-color:#3b82f6 !important; background:rgba(59,130,246,0.05) !important; }
        .rg-input-icon { width:44px !important; display:flex !important; align-items:center !important; justify-content:center !important; color:rgba(255,255,255,0.2) !important; flex-shrink:0 !important; }
        .rg-input-box input { flex:1 !important; background:transparent !important; border:none !important; outline:none !important; color:#e2e8f0 !important; font-family:'IBM Plex Sans',sans-serif !important; font-size:14px !important; padding:13px 14px 13px 0 !important; font-weight:300 !important; box-shadow:none !important; border-radius:0 !important; width:auto !important; }
        .rg-input-box input::placeholder { color:rgba(255,255,255,0.18) !important; }

        .rg-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:12px !important; }

        .rg-role-group { display:flex !important; gap:10px !important; margin-bottom:14px !important; }
        .rg-role-btn { flex:1 !important; display:flex !important; align-items:center !important; gap:10px !important; padding:12px 16px !important; border-radius:12px !important; cursor:pointer !important; border:0.5px solid rgba(255,255,255,0.09) !important; background:rgba(255,255,255,0.03) !important; transition:all 0.15s !important; }
        .rg-role-btn.active { border-color:rgba(59,130,246,0.4) !important; background:rgba(59,130,246,0.1) !important; }
        .rg-role-label { font-size:13px !important; font-weight:500 !important; color:rgba(255,255,255,0.4) !important; text-transform:capitalize !important; }
        .rg-role-btn.active .rg-role-label { color:#60a5fa !important; }

        .rg-error { display:flex !important; gap:8px !important; align-items:center !important; padding:10px 14px !important; background:rgba(192,57,43,0.1) !important; border:0.5px solid rgba(192,57,43,0.3) !important; border-radius:10px !important; color:#e57373 !important; font-size:13px !important; margin-bottom:14px !important; }

        .rg-btn { width:100% !important; padding:14px !important; background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%) !important; border:none !important; border-radius:12px !important; color:#fff !important; font-family:'Space Grotesk',sans-serif !important; font-size:15px !important; font-weight:600 !important; letter-spacing:0.3px !important; cursor:pointer !important; transition:opacity 0.2s,transform 0.15s !important; display:block !important; }
        .rg-btn:hover:not(:disabled) { opacity:0.88 !important; transform:translateY(-1px) !important; }
        .rg-btn:disabled { opacity:0.6 !important; cursor:not-allowed !important; }

        .rg-signin { text-align:center !important; margin-top:20px !important; font-size:13px !important; color:rgba(255,255,255,0.25) !important; font-weight:300 !important; }
        .rg-signin a { color:#60a5fa !important; text-decoration:none !important; font-weight:500 !important; }

        .rg-hint { font-size:11px !important; color:rgba(255,255,255,0.2) !important; margin-top:-10px !important; margin-bottom:14px !important; font-weight:300 !important; }

        .rg-right { width:340px !important; flex-shrink:0 !important; background:#0c1120 !important; padding:44px 36px !important; display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; position:relative !important; overflow:hidden !important; border-left:0.5px solid rgba(99,179,237,0.07) !important; }

        .rg-right-glow1 { position:absolute !important; top:-60px !important; right:-60px !important; width:280px !important; height:280px !important; background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .rg-right-glow2 { position:absolute !important; bottom:-60px !important; left:-60px !important; width:240px !important; height:240px !important; background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }

        .rg-right-icon { font-size:64px !important; margin-bottom:24px !important; position:relative !important; }
        .rg-right-title { font-family:'Bebas Neue',sans-serif !important; font-size:32px !important; color:#fff !important; text-align:center !important; line-height:1.1 !important; letter-spacing:1px !important; margin-bottom:16px !important; }
        .rg-right-title span { color:#3b82f6 !important; }
        .rg-right-desc { font-size:13px !important; color:rgba(255,255,255,0.3) !important; text-align:center !important; line-height:1.7 !important; font-weight:300 !important; max-width:240px !important; }

        .rg-features { margin-top:36px !important; width:100% !important; }
        .rg-feat { display:flex !important; align-items:center !important; gap:12px !important; padding:10px 0 !important; border-bottom:0.5px solid rgba(255,255,255,0.05) !important; }
        .rg-feat:last-child { border-bottom:none !important; }
        .rg-feat-icon { width:30px !important; height:30px !important; border-radius:8px !important; background:rgba(59,130,246,0.1) !important; border:0.5px solid rgba(59,130,246,0.2) !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; color:#60a5fa !important; }
        .rg-feat-text { font-size:12px !important; color:rgba(255,255,255,0.4) !important; font-weight:300 !important; }

        @media (max-width:768px) { .rg-right { display:none !important; } .rg-grid { grid-template-columns:1fr !important; } }
      `}</style>

      <div className="rg-wrap">
        <div className="rg-left">
          <div className="rg-glow1" />
          <div className="rg-glow2" />
          <div className="rg-inner">
            <div className="rg-logo">
              <div className="rg-logo-icon"><Calendar size={18} color="#fff" /></div>
              <div>
                <div className="rg-logo-name">EventHub</div>
                <div className="rg-logo-inst">FEU Roosevelt</div>
              </div>
            </div>

            <div className="rg-heading">Create<br /><span>Account.</span></div>
            <div className="rg-subtext">Join EventHub to discover and register for campus events</div>

            <form onSubmit={handleSubmit}>
              <label className="rg-label">Full Name</label>
              <div className="rg-input-box">
                <div className="rg-input-icon"><User size={14} /></div>
                <input name="fullName" placeholder="Juan dela Cruz" value={form.fullName} onChange={handleChange} required />
              </div>

              <label className="rg-label">Email</label>
              <div className="rg-input-box">
                <div className="rg-input-icon"><Mail size={14} /></div>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>

              <div className="rg-grid">
                <div>
                  <label className="rg-label">Password</label>
                  <div className="rg-input-box">
                    <div className="rg-input-icon"><Lock size={14} /></div>
                    <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label className="rg-label">Confirm Password</label>
                  <div className="rg-input-box">
                    <div className="rg-input-icon"><Lock size={14} /></div>
                    <input type="password" name="confirm" placeholder="••••••••" value={form.confirm} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <label className="rg-label">Account Type</label>
              <div className="rg-role-group">
                {['user', 'admin'].map(role => (
                  <label key={role} className={`rg-role-btn${form.role === role ? ' active' : ''}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={handleChange} style={{ display: 'none' }} />
                    {role === 'admin' ? <ShieldCheck size={15} color={form.role === role ? '#60a5fa' : 'rgba(255,255,255,0.2)'} /> : <User size={15} color={form.role === role ? '#60a5fa' : 'rgba(255,255,255,0.2)'} />}
                    <span className="rg-role-label">{role}</span>
                  </label>
                ))}
              </div>

              {form.role === 'admin' && (
                <>
                  <label className="rg-label">Admin Access Code</label>
                  <div className="rg-input-box">
                    <div className="rg-input-icon"><ShieldCheck size={14} /></div>
                    <input name="adminCode" placeholder="Enter admin code" value={form.adminCode} onChange={handleChange} />
                  </div>
                  <div className="rg-hint">Contact your institution for the admin code</div>
                </>
              )}

              {error && (
                <div className="rg-error"><AlertCircle size={15} /> {error}</div>
              )}

              <button className="rg-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p className="rg-signin">
              Already have an account?{' '}<Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="rg-right">
          <div className="rg-right-glow1" />
          <div className="rg-right-glow2" />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="rg-right-icon">🎟️</div>
            <div className="rg-right-title">Your Campus<br /><span>Ticket Hub.</span></div>
            <div className="rg-right-desc">Get a QR-coded ticket instantly after registering for any event.</div>
            <div className="rg-features">
              <div className="rg-feat">
                <div className="rg-feat-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="rg-feat-text">Instant QR ticket on registration</div>
              </div>
              <div className="rg-feat">
                <div className="rg-feat-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="rg-feat-text">Seamless check-in at the entrance</div>
              </div>
              <div className="rg-feat">
                <div className="rg-feat-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                </div>
                <div className="rg-feat-text">Track all your registered events</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}