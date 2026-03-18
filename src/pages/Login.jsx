import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, Mail, Lock, AlertCircle } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        .eh-wrap { min-height:100vh !important; display:flex !important; font-family:'IBM Plex Sans',sans-serif !important; background:#080c14 !important; flex-direction:row !important; }
        .eh-left { flex:1 !important; background:#080c14 !important; padding:44px 50px !important; display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; position:relative !important; overflow:hidden !important; }
        .eh-left-glow1 { position:absolute !important; top:-100px !important; left:-100px !important; width:350px !important; height:350px !important; background:radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .eh-left-glow2 { position:absolute !important; bottom:-80px !important; right:20px !important; width:260px !important; height:260px !important; background:radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .eh-inner { width:100% !important; max-width:420px !important; display:flex !important; flex-direction:column !important; gap:0 !important; position:relative !important; }
        .eh-logo { display:flex !important; align-items:center !important; gap:11px !important; margin-bottom:40px !important; }
        .eh-logo-icon { width:40px !important; height:40px !important; background:linear-gradient(135deg,#3b82f6,#6366f1) !important; border-radius:11px !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; }
        .eh-logo-name { font-family:'Space Grotesk',sans-serif !important; font-weight:700 !important; font-size:18px !important; color:#fff !important; letter-spacing:-0.4px !important; margin:0 !important; }
        .eh-logo-inst { font-size:10px !important; color:rgba(255,255,255,0.3) !important; letter-spacing:2px !important; text-transform:uppercase !important; font-weight:400 !important; margin:0 !important; }
        .eh-badge { display:inline-flex !important; align-items:center !important; gap:6px !important; background:rgba(59,130,246,0.1) !important; border:0.5px solid rgba(59,130,246,0.25) !important; color:#93c5fd !important; font-size:11px !important; font-weight:500 !important; letter-spacing:0.8px !important; padding:5px 12px !important; border-radius:100px !important; margin-bottom:18px !important; }
        .eh-badge-dot { width:6px !important; height:6px !important; border-radius:50% !important; background:#3b82f6 !important; display:inline-block !important; flex-shrink:0 !important; }
        .eh-heading { font-family:'Bebas Neue',sans-serif !important; font-size:52px !important; color:#fff !important; letter-spacing:1px !important; line-height:0.95 !important; margin-bottom:10px !important; font-weight:400 !important; }
        .eh-heading span { color:#3b82f6 !important; }
        .eh-subtext { font-size:13px !important; color:rgba(255,255,255,0.35) !important; font-weight:300 !important; margin-bottom:34px !important; }
        .eh-field { margin-bottom:14px !important; }
        .eh-label { display:block !important; font-size:10px !important; color:rgba(255,255,255,0.3) !important; letter-spacing:1.8px !important; text-transform:uppercase !important; font-weight:500 !important; margin-bottom:7px !important; }
        .eh-input-box { display:flex !important; align-items:center !important; background:rgba(255,255,255,0.04) !important; border:0.5px solid rgba(255,255,255,0.09) !important; border-radius:12px !important; transition:border-color 0.2s,background 0.2s !important; padding:0 !important; }
        .eh-input-box:focus-within { border-color:#3b82f6 !important; background:rgba(59,130,246,0.05) !important; }
        .eh-input-icon { width:44px !important; display:flex !important; align-items:center !important; justify-content:center !important; color:rgba(255,255,255,0.2) !important; flex-shrink:0 !important; }
        .eh-input-box input { flex:1 !important; background:transparent !important; border:none !important; outline:none !important; color:#e2e8f0 !important; font-family:'IBM Plex Sans',sans-serif !important; font-size:14px !important; padding:13px 14px 13px 0 !important; font-weight:300 !important; box-shadow:none !important; border-radius:0 !important; width:auto !important; }
        .eh-input-box input::placeholder { color:rgba(255,255,255,0.18) !important; }
        .eh-forgot-row { display:flex !important; justify-content:flex-end !important; margin-top:-4px !important; margin-bottom:24px !important; }
        .eh-forgot { font-size:12px !important; color:#60a5fa !important; text-decoration:none !important; font-weight:500 !important; }
        .eh-error { display:flex !important; gap:8px !important; align-items:center !important; padding:10px 14px !important; background:rgba(192,57,43,0.1) !important; border:0.5px solid rgba(192,57,43,0.3) !important; border-radius:10px !important; color:#e57373 !important; font-size:13px !important; margin-bottom:14px !important; }
        .eh-btn { width:100% !important; padding:14px !important; background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%) !important; border:none !important; border-radius:12px !important; color:#fff !important; font-family:'Space Grotesk',sans-serif !important; font-size:15px !important; font-weight:600 !important; letter-spacing:0.3px !important; cursor:pointer !important; transition:opacity 0.2s,transform 0.15s !important; display:block !important; }
        .eh-btn:hover:not(:disabled) { opacity:0.88 !important; transform:translateY(-1px) !important; }
        .eh-btn:active:not(:disabled) { transform:scale(0.99) !important; }
        .eh-btn:disabled { opacity:0.6 !important; cursor:not-allowed !important; }
        .eh-signup { text-align:center !important; margin-top:20px !important; font-size:13px !important; color:rgba(255,255,255,0.25) !important; font-weight:300 !important; }
        .eh-signup a { color:#60a5fa !important; text-decoration:none !important; font-weight:500 !important; }
        .eh-right { width:340px !important; flex-shrink:0 !important; background:#0c1120 !important; padding:44px 36px !important; display:flex !important; flex-direction:column !important; justify-content:space-between !important; position:relative !important; overflow:hidden !important; border-left:0.5px solid rgba(99,179,237,0.07) !important; }
        .eh-right-glow1 { position:absolute !important; top:-60px !important; right:-60px !important; width:280px !important; height:280px !important; background:radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .eh-right-glow2 { position:absolute !important; bottom:-60px !important; left:-60px !important; width:240px !important; height:240px !important; background:radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%) !important; border-radius:50% !important; pointer-events:none !important; }
        .eh-stat-grid { display:grid !important; grid-template-columns:1fr 1fr !important; gap:10px !important; position:relative !important; }
        .eh-stat-card { background:rgba(255,255,255,0.03) !important; border:0.5px solid rgba(255,255,255,0.07) !important; border-radius:12px !important; padding:16px 14px !important; }
        .eh-stat-card.accent { background:rgba(59,130,246,0.08) !important; border-color:rgba(59,130,246,0.2) !important; grid-column:1 / -1 !important; }
        .eh-stat-num { font-family:'Space Grotesk',sans-serif !important; font-size:26px !important; font-weight:700 !important; color:#fff !important; letter-spacing:-1px !important; line-height:1 !important; margin:0 !important; }
        .eh-stat-card.accent .eh-stat-num { color:#60a5fa !important; font-size:30px !important; }
        .eh-stat-label { font-size:11px !important; color:rgba(255,255,255,0.3) !important; font-weight:300 !important; margin-top:4px !important; line-height:1.4 !important; margin-bottom:0 !important; }
        .eh-divider { height:0.5px !important; background:rgba(255,255,255,0.07) !important; margin:20px 0 !important; border:none !important; }
        .eh-feat { display:flex !important; align-items:center !important; gap:12px !important; padding:10px 0 !important; border-bottom:0.5px solid rgba(255,255,255,0.05) !important; }
        .eh-feat:last-child { border-bottom:none !important; }
        .eh-feat-icon { width:32px !important; height:32px !important; border-radius:9px !important; background:rgba(59,130,246,0.1) !important; border:0.5px solid rgba(59,130,246,0.2) !important; display:flex !important; align-items:center !important; justify-content:center !important; flex-shrink:0 !important; color:#60a5fa !important; }
        .eh-feat-text { font-size:12px !important; color:rgba(255,255,255,0.55) !important; font-weight:300 !important; line-height:1.4 !important; margin:0 !important; }
        .eh-feat-text strong { color:rgba(255,255,255,0.8) !important; font-weight:500 !important; display:block !important; font-size:12.5px !important; }
        .eh-big-text { font-family:'Bebas Neue',sans-serif !important; font-size:38px !important; line-height:0.95 !important; letter-spacing:1px !important; color:rgba(255,255,255,0.08) !important; margin-top:10px !important; }
        .eh-big-text span { color:rgba(59,130,246,0.25) !important; }
        @media (max-width:768px) { .eh-right { display:none !important; } }
      `}</style>

      <div className="eh-wrap">
        <div className="eh-left">
          <div className="eh-left-glow1" />
          <div className="eh-left-glow2" />
          <div className="eh-inner">
            <div className="eh-logo">
              <div className="eh-logo-icon"><Calendar size={18} color="#fff" /></div>
              <div>
                <div className="eh-logo-name">EventHub</div>
                <div className="eh-logo-inst">FEU Roosevelt</div>
              </div>
            </div>
            <div className="eh-badge"><div className="eh-badge-dot" />Student Portal</div>
            <div className="eh-heading">Welcome<br /><span>Back.</span></div>
            <div className="eh-subtext">Sign in to your account to continue</div>
            <form onSubmit={handleSubmit}>
              <div className="eh-field">
                <label className="eh-label">Email Address</label>
                <div className="eh-input-box">
                  <div className="eh-input-icon"><Mail size={14} /></div>
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="eh-field">
                <label className="eh-label">Password</label>
                <div className="eh-input-box">
                  <div className="eh-input-icon"><Lock size={14} /></div>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
              <div className="eh-forgot-row">
                <a href="#" className="eh-forgot">Forgot password?</a>
              </div>
              {error && (
                <div className="eh-error"><AlertCircle size={15} /> {error}</div>
              )}
              <button className="eh-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
            <p className="eh-signup">
              Don't have an account?{' '}<Link to="/register">Create one</Link>
            </p>
          </div>
        </div>

        <div className="eh-right">
          <div className="eh-right-glow1" />
          <div className="eh-right-glow2" />
          <div className="eh-stat-grid">
            <div className="eh-stat-card accent">
              <div className="eh-stat-num">120+</div>
              <div className="eh-stat-label">Campus events this semester</div>
            </div>
            <div className="eh-stat-card">
              <div className="eh-stat-num">4.8k</div>
              <div className="eh-stat-label">Active students</div>
            </div>
            <div className="eh-stat-card">
              <div className="eh-stat-num">98%</div>
              <div className="eh-stat-label">Check-in rate</div>
            </div>
          </div>
          <div className="eh-divider" />
          <div>
            <div className="eh-feat">
              <div className="eh-feat-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className="eh-feat-text"><strong>Instant QR Ticket</strong>Register and get your pass immediately</div>
            </div>
            <div className="eh-feat">
              <div className="eh-feat-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="eh-feat-text"><strong>Live Event Tracking</strong>Stay updated on all campus activity</div>
            </div>
            <div className="eh-feat">
              <div className="eh-feat-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="eh-feat-text"><strong>Seamless Check-in</strong>Scan at entrance, no queue</div>
            </div>
          </div>
          <div className="eh-big-text">CAMPUS<br /><span>EVENTS</span></div>
        </div>
      </div>
    </>
  )
}