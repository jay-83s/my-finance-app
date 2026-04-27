import { useState } from 'react'
import { Eye, EyeOff, TrendingUp, Shield, Zap } from 'lucide-react'
import { login, signup, forgotPassword, resetPassword } from '../api/index'

export default function Login({ onLogin }) {
  const [mode, setMode]                       = useState('login')
  const [form, setForm]                       = useState({ name: '', email: '', password: '', newPassword: '', resetToken: '' })
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')
  const [loading, setLoading]                 = useState(false)
  const [showPassword, setShowPassword]       = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
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
        setSuccess('Reset email sent! Check your inbox and click the link.')
      } else if (mode === 'reset') {
        await resetPassword({ email: form.email, token: form.resetToken, newPassword: form.newPassword })
        setMode('login')
        setSuccess('Password reset successfully! Please log in.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const titles = {
    login:  { sub: 'Sign in to your account',               btn: 'Sign In'          },
    signup: { sub: 'Start your financial journey',          btn: 'Create Account'   },
    forgot: { sub: 'Enter your email to get a reset link',  btn: 'Send Reset Email' },
    reset:  { sub: 'Enter your new password',               btn: 'Reset Password'   },
  }
  const t = titles[mode]

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: '1.5px solid rgba(255,255,255,0.08)',
    marginBottom: 12,
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: 'rgba(255,255,255,0.05)',
    color: '#E8F4FF',
    transition: 'border-color 0.2s, background 0.2s',
  }

  const features = [
    { icon: TrendingUp, text: 'Track income, savings & expenses in real time' },
    { icon: Shield,     text: 'Pay Yourself First — save before you spend'    },
    { icon: Zap,        text: 'Analytics & insights to grow your wealth'      },
  ]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0) scale(1);       }
          50%       { transform: translate(20px,-30px) scale(1.06); }
        }

        .login-input:focus {
          border-color: rgba(20,184,166,0.7) !important;
          background: rgba(255,255,255,0.08) !important;
        }
        .login-input::placeholder { color: rgba(180,210,240,0.35); }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(20,184,166,0.5) !important;
        }
        .login-submit { transition: all 0.22s ease !important; }

        .tab-pill:hover { color: rgba(220,240,255,0.85) !important; }

        .feature-item {
          animation: fadeUp 0.5s ease both;
        }
        .feature-item:nth-child(1) { animation-delay: 0.3s; }
        .feature-item:nth-child(2) { animation-delay: 0.45s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }

        /* Mobile: stack vertically */
        @media (max-width: 768px) {
          .login-left  { display: none !important; }
          .login-right { border-radius: 0 !important; min-height: 100vh !important; }
          .login-root  { align-items: stretch !important; }
        }
      `}</style>

      {/* ROOT */}
      <div className="login-root" style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        background: '#060D1A',
      }}>

        {/* ── LEFT PANEL — image + branding ── */}
        <div className="login-left" style={{
          flex: '1 1 55%',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '48px',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/sean-pollock-PhYq704ffdA-unsplash.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }} />

          {/* Gradient overlay — dark at bottom for text, subtle at top */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(170deg, rgba(6,13,26,0.35) 0%, rgba(6,13,26,0.6) 45%, rgba(6,13,26,0.93) 100%)',
            zIndex: 1,
          }} />

          {/* Teal brand tint */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 70% 20%, rgba(20,184,166,0.12) 0%, transparent 60%)',
            zIndex: 2,
          }} />

          {/* Logo top-left */}
          <div style={{
            position: 'absolute', top: 40, left: 48,
            display: 'flex', alignItems: 'center', gap: 12,
            zIndex: 10,
            animation: 'fadeIn 0.6s ease both',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 4px 20px rgba(20,184,166,0.45)',
            }}>💰</div>
            <div>
              <p style={{
                margin: 0, fontSize: 18, fontWeight: 800,
                color: '#fff', fontFamily: "'Sora', sans-serif",
                letterSpacing: '-0.3px',
              }}>FinanceApp</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(180,220,240,0.55)' }}>
                Personal Finance Platform
              </p>
            </div>
          </div>

          {/* Bottom branding content */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h1 style={{
              margin: '0 0 12px',
              fontSize: 42, fontWeight: 900,
              fontFamily: "'Sora', sans-serif",
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: '-1px',
            }}>
              Take control of<br />
              <span style={{
                background: 'linear-gradient(90deg, #14B8A6, #34D399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                your money.
              </span>
            </h1>
            <p style={{
              margin: '0 0 32px',
              fontSize: 15, color: 'rgba(180,220,240,0.6)',
              lineHeight: 1.6, maxWidth: 380,
            }}>
              The smart way to budget, save, and grow your wealth — built on the Pay Yourself First principle.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {features.map(({ icon: Icon, text }) => (
                <div className="feature-item" key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(20,184,166,0.15)',
                    border: '1px solid rgba(20,184,166,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color="#14B8A6" strokeWidth={2.2} />
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(210,235,255,0.75)', lineHeight: 1.4 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Credit */}
            <p style={{
              margin: '40px 0 0', fontSize: 11,
              color: 'rgba(180,220,240,0.25)',
            }}>
              Photo by Sean Pollock · Unsplash
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL — form ── */}
        <div className="login-right" style={{
          flex: '0 0 420px',
          minHeight: '100vh',
          background: 'rgba(6, 14, 28, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 40px',
          position: 'relative',
          zIndex: 20,
          animation: 'fadeUp 0.5s ease both',
        }}>

          {/* Teal glow top */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Mobile-only logo */}
          <div style={{
            display: 'none',
            alignItems: 'center', gap: 12,
            marginBottom: 32,
          }} className="mobile-logo">
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #14B8A6, #10B981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>💰</div>
            <p style={{
              margin: 0, fontSize: 18, fontWeight: 800,
              color: '#fff', fontFamily: "'Sora', sans-serif",
            }}>FinanceApp</p>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              margin: '0 0 6px', fontSize: 26, fontWeight: 800,
              color: '#F0F7FF', fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.4px',
            }}>
              {mode === 'login'  ? 'Welcome back'      :
               mode === 'signup' ? 'Create account'    :
               mode === 'forgot' ? 'Forgot password'   : 'Reset password'}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(180,210,240,0.45)' }}>
              {t.sub}
            </p>
          </div>

          {/* Toggle */}
          {(mode === 'login' || mode === 'signup') && (
            <div style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 14, padding: 4, marginBottom: 28,
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['login', 'signup'].map((m, i) => (
                <button
                  key={m}
                  className="tab-pill"
                  onClick={() => { setMode(m); setError(''); setSuccess('') }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 11,
                    border: 'none', cursor: 'pointer',
                    background: mode === m
                      ? 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)'
                      : 'transparent',
                    color: mode === m ? '#fff' : 'rgba(180,210,240,0.4)',
                    fontWeight: 700, fontSize: 13,
                    boxShadow: mode === m ? '0 4px 16px rgba(20,184,166,0.35)' : 'none',
                    transition: 'all 0.2s',
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
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none', color: '#14B8A6',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                marginBottom: 24, padding: 0, textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >← Back to Sign In</button>
          )}

          {/* Name */}
          {mode === 'signup' && (
            <input
              className="login-input"
              placeholder="Full Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
          )}

          {/* Email */}
          <input
            className="login-input"
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          {/* Password */}
          {(mode === 'login' || mode === 'signup') && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input
                className="login-input"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', padding: 0,
              }}>
                {showPassword
                  ? <EyeOff size={17} color="rgba(180,210,240,0.4)" />
                  : <Eye    size={17} color="rgba(180,210,240,0.4)" />}
              </button>
            </div>
          )}

          {/* Reset token */}
          {mode === 'reset' && (
            <input
              className="login-input"
              placeholder="Reset token from your email"
              value={form.resetToken}
              onChange={e => setForm({ ...form, resetToken: e.target.value })}
              style={inputStyle}
            />
          )}

          {/* New password */}
          {mode === 'reset' && (
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input
                className="login-input"
                placeholder="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
              />
              <button onClick={() => setShowNewPassword(!showNewPassword)} style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', padding: 0,
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
              <button
                onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                style={{
                  background: 'none', border: 'none', color: '#14B8A6',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >Forgot password?</button>
            </div>
          )}

          {/* Already have token */}
          {mode === 'forgot' && (
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button
                onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                style={{
                  background: 'none', border: 'none', color: '#14B8A6',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >Already have a reset token? →</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ color: '#FCA5A5', fontSize: 13, margin: 0, textAlign: 'center' }}>
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ color: '#6EE7B7', fontSize: 13, margin: 0, textAlign: 'center' }}>
                {success}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            className="login-submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: 14,
              border: 'none',
              background: loading
                ? 'rgba(20,184,166,0.3)'
                : 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: loading ? 'none' : '0 8px 28px rgba(20,184,166,0.4)',
              letterSpacing: '0.2px',
              marginTop: mode === 'login' ? 0 : 4,
            }}
          >
            {loading ? 'Please wait...' : t.btn}
          </button>

          {/* Tagline */}
          <p style={{
            textAlign: 'center', marginTop: 28, marginBottom: 0,
            fontSize: 12, color: 'rgba(180,210,240,0.22)',
            letterSpacing: '0.8px', textTransform: 'uppercase',
          }}>
            Pay Yourself First · Track · Grow
          </p>

        </div>
      </div>
    </>
  )
}