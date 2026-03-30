import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { login, signup, forgotPassword, resetPassword } from '../api/index'
import { COLORS } from '../utils/theme'

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
    login:  { sub: 'Sign in to your account',          btn: 'Login'            },
    signup: { sub: 'Start managing your money',        btn: 'Create Account'   },
    forgot: { sub: 'Enter your email to get a reset link', btn: 'Send Reset Email' },
    reset:  { sub: 'Enter your new password',          btn: 'Reset Password'   },
  }

  const t = titles[mode]

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.bg,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{
        background: COLORS.card, borderRadius: 24,
        padding: 32, width: '100%', maxWidth: 400,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 20,
            background: COLORS.teal, margin: '0 auto 12px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28,
          }}>
            💰
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            FinanceApp
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: '4px 0 0' }}>
            {t.sub}
          </p>
        </div>

        {/* Toggle — login/signup only */}
        {(mode === 'login' || mode === 'signup') && (
          <div style={{
            display: 'flex', background: COLORS.bg,
            borderRadius: 12, padding: 4, marginBottom: 24,
          }}>
            {['login', 'signup'].map((m, i) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  background: mode === m ? COLORS.card : 'transparent',
                  color: mode === m ? COLORS.text : COLORS.muted,
                  fontWeight: 700, fontSize: 13,
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {i === 0 ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Back button — forgot and reset */}
        {(mode === 'forgot' || mode === 'reset') && (
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            style={{
              background: 'none', border: 'none', color: COLORS.teal,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              marginBottom: 20, padding: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Back to Login
          </button>
        )}

        {/* Name — signup only */}
        {mode === 'signup' && (
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: 12, border: '1.5px solid #E8EEF4',
              marginBottom: 12, fontSize: 14,
              boxSizing: 'border-box', outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        )}

        {/* Email — all modes */}
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 12, border: '1.5px solid #E8EEF4',
            marginBottom: 12, fontSize: 14,
            boxSizing: 'border-box', outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Password — login and signup */}
        {(mode === 'login' || mode === 'signup') && (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '14px 48px 14px 16px',
                borderRadius: 12, border: '1.5px solid #E8EEF4',
                fontSize: 14, boxSizing: 'border-box', outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={18} color={COLORS.muted} /> : <Eye size={18} color={COLORS.muted} />}
            </button>
          </div>
        )}

        {/* Reset token — reset mode only */}
        {mode === 'reset' && (
          <input
            placeholder="Reset token from your email"
            value={form.resetToken}
            onChange={e => setForm({ ...form, resetToken: e.target.value })}
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: 12, border: '1.5px solid #E8EEF4',
              marginBottom: 12, fontSize: 14,
              boxSizing: 'border-box', outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        )}

        {/* New Password — reset mode only */}
        {mode === 'reset' && (
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <input
              placeholder="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              style={{
                width: '100%', padding: '14px 48px 14px 16px',
                borderRadius: 12, border: '1.5px solid #E8EEF4',
                fontSize: 14, boxSizing: 'border-box', outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', padding: 0,
              }}
            >
              {showNewPassword ? <EyeOff size={18} color={COLORS.muted} /> : <Eye size={18} color={COLORS.muted} />}
            </button>
          </div>
        )}

        {/* Forgot password link — login only */}
        {mode === 'login' && (
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <button
              onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none',
                color: COLORS.teal, fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Already have reset token link — forgot mode */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <button
              onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none',
                color: COLORS.teal, fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Already have a reset token? →
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: COLORS.green, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
            {success}
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            border: 'none', background: COLORS.teal,
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 8px 24px ${COLORS.teal}66`,
          }}
        >
          {loading ? 'Please wait...' : t.btn}
        </button>

      </div>
    </div>
  )
}