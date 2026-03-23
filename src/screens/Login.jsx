import { useState } from 'react'
import { login, signup } from '../api/index'
import { COLORS } from '../utils/theme'

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const res = await login({ email: form.email, password: form.password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onLogin(res.data.user)
      } else {
        await signup({ name: form.name, email: form.email, password: form.password })
        setIsLogin(true)
        setError('Account created! Please log in.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }

    setLoading(false)
  }

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
          <h1 style={{
            margin: 0, fontSize: 24, fontWeight: 800,
            color: COLORS.text, fontFamily: "'Sora', sans-serif",
          }}>
            FinanceApp
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: '4px 0 0' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: COLORS.bg,
          borderRadius: 12, padding: 4, marginBottom: 24,
        }}>
          {['Login', 'Sign Up'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setIsLogin(i === 0); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 10,
                border: 'none', cursor: 'pointer',
                background: isLogin === (i === 0) ? COLORS.card : 'transparent',
                color: isLogin === (i === 0) ? COLORS.text : COLORS.muted,
                fontWeight: 700, fontSize: 13,
                boxShadow: isLogin === (i === 0) ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        {!isLogin && (
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

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%', padding: '14px 16px',
            borderRadius: 12, border: '1.5px solid #E8EEF4',
            marginBottom: 16, fontSize: 14,
            boxSizing: 'border-box', outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Error message */}
        {error && (
          <p style={{
            color: error.includes('created') ? COLORS.green : COLORS.red,
            fontSize: 13, marginBottom: 16, textAlign: 'center',
          }}>
            {error}
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
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>

      </div>
    </div>
  )
}