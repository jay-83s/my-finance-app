import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, Shield, Zap } from 'lucide-react'
import { login, signup, forgotPassword, resetPassword } from '../api/index'
import { useTheme } from '../context/ThemeContext'

const features = [
  { icon: TrendingUp, text: 'Track income, savings & expenses in real time' },
  { icon: Shield,     text: 'Pay Yourself First — save before you spend'    },
  { icon: Zap,        text: 'Smart analytics & insights to grow your wealth' },
]

export default function Login({ onLogin }) {
  const { isDark } = useTheme()

  const [mode, setMode]                       = useState('login')
  const [form, setForm]                       = useState({ name: '', email: '', password: '', newPassword: '', resetToken: '' })
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')
  const [loading, setLoading]                 = useState(false)
  const [showPassword, setShowPassword]       = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'login') {
        const res = await login({ email: form.email, password: form.password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onLogin(res.data.user)
      } else if (mode === 'signup') {
        await signup({ name: form.name, email: form.email, password: form.password })
        setMode('login')
        setSuccess('Account created! Check your email for a welcome message.')
      } else if (mode === 'forgot') {
        await forgotPassword({ email: form.email })
        setSuccess('Reset email sent! Check your inbox.')
      } else if (mode === 'reset') {
        await resetPassword({ email: form.email, token: form.resetToken, newPassword: form.newPassword })
        setMode('login')
        setSuccess('Password reset! Please log in.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const titles = {
    login:  { heading: 'Welcome back',      sub: 'Sign in to your account',              btn: 'Sign In'          },
    signup: { heading: 'Create account',    sub: 'Start your financial journey',         btn: 'Create Account'   },
    forgot: { heading: 'Forgot password',   sub: 'Enter your email for a reset link',    btn: 'Send Reset Email' },
    reset:  { heading: 'Reset password',    sub: 'Enter your new password',              btn: 'Reset Password'   },
  }
  const t = titles[mode]

  // Adaptive to dark/light
  const overlayBg   = isDark
    ? 'linear-gradient(175deg, rgba(4,10,20,0.4) 0%, rgba(4,10,20,0.65) 45%, rgba(4,10,20,0.95) 100%)'
    : 'linear-gradient(175deg, rgba(4,10,20,0.25) 0%, rgba(4,10,20,0.55) 45%, rgba(4,10,20,0.92) 100%)'
  const panelBg     = isDark ? 'rgba(4,12,24,0.94)' : 'rgba(8,20,45,0.88)'
  const inputBg     = 'rgba(255,255,255,0.06)'
  const inputBorder = 'rgba(255,255,255,0.09)'

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    border: `1.5px solid ${inputBorder}`,
    marginBottom: 12, fontSize: 14,
    boxSizing: 'border-box', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: inputBg, color: '#E8F4FF',
    transition: 'border-color 0.2s, background 0.2s',
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        .fi-input:focus {
          border-color: rgba(11,191,191,0.65) !important;
          background: rgba(255,255,255,0.09) !important;
        }
        .fi-input::placeholder { color: rgba(180,210,240,0.32); }
        .fi-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(11,191,191,0.5) !important;
        }
        .fi-btn { transition: all 0.2s ease !important; }
        .fi-tab:hover { color: rgba(230,245,255,0.85) !important; }
        .fi-feat { animation: fadeUp 0.5s ease both; }
        .fi-feat:nth-child(1) { animation-delay: 0.3s; }
        .fi-feat:nth-child(2) { animation-delay: 0.45s; }
        .fi-feat:nth-child(3) { animation-delay: 0.6s; }
        @media (max-width: 768px) {
          .fi-left  { display: none !important; }
          .fi-right {
            border-radius: 0 !important;
            min-height: 100vh !important;
            flex: 1 !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex',
        fontFamily: "'DM Sans', sans-serif",
        background: '#060D1A',
      }}>

        {/* ── LEFT — image + branding ── */}
        <div className="fi-left" style={{
          flex: '1 1 58%', position: 'relative',
          overflow: 'hidden', minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '48px',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/sean-pollock-PhYq704ffdA-unsplash.jpg)',
            backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
          }} />

          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: overlayBg, zIndex: 1 }} />

          {/* Teal brand tint */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 75% 15%, rgba(11,191,191,0.13) 0%, transparent 60%)',
            zIndex: 2,
          }} />

          {/* Logo — top left */}
          <div style={{
            position: 'absolute', top: 40, left: 48,
            display: 'flex', alignItems: 'center', gap: 12, zIndex: 10,
            animation: 'fadeIn 0.6s ease both',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, fontSize: 22,
              background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(11,191,191,0.45)',
            }}>💰</div>
            <div>
              <p style={{
                margin: 0, fontSize: 18, fontWeight: 800, color: '#fff',
                fontFamily: "'Sora', sans-serif", letterSpacing: '-0.3px',
              }}>FinanceApp</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(180,220,240,0.55)' }}>
                Personal Finance Platform
              </p>
            </div>
          </div>

          {/* Bottom branding */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{
              margin: '0 0 12px', fontSize: 44, fontWeight: 900,
              fontFamily: "'Sora', sans-serif",
              color: '#fff', lineHeight: 1.12, letterSpacing: '-1px',
            }}>
              Take control of<br />
              <span style={{
                background: 'linear-gradient(90deg, #0BBFBF, #34D399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>your money.</span>
            </h1>
            <p style={{
              margin: '0 0 32px', fontSize: 15,
              color: 'rgba(180,220,240,0.6)', lineHeight: 1.65, maxWidth: 380,
            }}>
              The smart way to budget, save, and grow your wealth — built on the Pay Yourself First principle.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {features.map(({ icon: Icon, text }) => (
                <div className="fi-feat" key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(11,191,191,0.15)',
                    border: '1px solid rgba(11,191,191,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color="#0BBFBF" strokeWidth={2.2} />
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(210,235,255,0.75)', lineHeight: 1.4 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ margin: '36px 0 0', fontSize: 11, color: 'rgba(180,220,240,0.22)' }}>
              Photo by Sean Pollock · Unsplash
            </p>
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div className="fi-right" style={{
          flex: '0 0 400px', minHeight: '100vh',
          background: panelBg,
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '48px 36px',
          position: 'relative', zIndex: 20,
          animation: 'fadeUp 0.5s ease both',
          transition: 'background 0.4s ease',
        }}>

          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(11,191,191,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              margin: '0 0 6px', fontSize: 26, fontWeight: 800,
              color: '#F0F7FF', fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.4px',
            }}>{t.heading}</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(180,210,240,0.45)' }}>{t.sub}</p>
          </div>

          {/* Login / Signup toggle */}
          {(mode === 'login' || mode === 'signup') && (
            <div style={{
              display: 'flex', background: 'rgba(0,0,0,0.3)',
              borderRadius: 14, padding: 4, marginBottom: 24,
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {['login', 'signup'].map((m, i) => (
                <button key={m} className="fi-tab"
                  onClick={() => { setMode(m); setError(''); setSuccess('') }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 11, border: 'none',
                    background: mode === m
                      ? 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)'
                      : 'transparent',
                    color: mode === m ? '#fff' : 'rgba(180,210,240,0.4)',
                    fontWeight: 700, fontSize: 13,
                    boxShadow: mode === m ? '0 4px 16px rgba(11,191,191,0.35)' : 'none',
                    transition: 'all 0.2s', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {i === 0 ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          {/* Back */}
          {(mode === 'forgot' || mode === 'reset') && (
            <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none', color: '#0BBFBF',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                marginBottom: 24, padding: 0, textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}>← Back to Sign In</button>
          )}

          {/* Name */}
          {mode === 'signup' && (
            <input className="fi-input" placeholder="Full Name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle} />
          )}

          {/* Email */}
          <input className="fi-input" placeholder="Email address" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle} />

          {/* Password */}
          {(mode === 'login' || mode === 'signup') && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input className="fi-input" placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }} />
              <button onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0,
              }}>
                {showPassword
                  ? <EyeOff size={17} color="rgba(180,210,240,0.4)" />
                  : <Eye    size={17} color="rgba(180,210,240,0.4)" />}
              </button>
            </div>
          )}

          {/* Reset token */}
          {mode === 'reset' && (
            <input className="fi-input" placeholder="Reset token from your email"
              value={form.resetToken}
              onChange={e => setForm({ ...form, resetToken: e.target.value })}
              style={inputStyle} />
          )}

          {/* New password */}
          {mode === 'reset' && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input className="fi-input" placeholder="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }} />
              <button onClick={() => setShowNewPassword(!showNewPassword)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0,
              }}>
                {showNewPassword
                  ? <EyeOff size={17} color="rgba(180,210,240,0.4)" />
                  : <Eye    size={17} color="rgba(180,210,240,0.4)" />}
              </button>
            </div>
          )}

          {/* Forgot link */}
          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 2 }}>
              <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                style={{
                  background: 'none', border: 'none', color: '#0BBFBF',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>Forgot password?</button>
            </div>
          )}

          {/* Already have token */}
          {mode === 'forgot' && (
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                style={{
                  background: 'none', border: 'none', color: '#0BBFBF',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>Already have a reset token? →</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ color: '#FCA5A5', fontSize: 13, margin: 0, textAlign: 'center' }}>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ color: '#6EE7B7', fontSize: 13, margin: 0, textAlign: 'center' }}>{success}</p>
            </div>
          )}

          {/* Submit */}
          <button className="fi-btn" onClick={handleSubmit} disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: loading
                ? 'rgba(11,191,191,0.3)'
                : 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: loading ? 'none' : '0 8px 28px rgba(11,191,191,0.4)',
              letterSpacing: '0.2px', marginTop: 4,
            }}>
            {loading ? 'Please wait...' : t.btn}
          </button>

          <p style={{
            textAlign: 'center', marginTop: 28, marginBottom: 0,
            fontSize: 11, color: 'rgba(180,210,240,0.2)',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Pay Yourself First · Track · Grow
          </p>
        </div>
      </div>
    </>
  )
}