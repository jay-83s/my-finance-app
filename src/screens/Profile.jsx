import { useState } from 'react'
import { updateProfile, changePassword } from '../api/index'
import { User, Mail, Shield, LogOut, Crown, Moon, Sun, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { LIGHT, DARK } from '../utils/theme'

export default function Profile({ user, onLogout, isDesktop }) {
  const { isDark, toggleTheme } = useTheme()
  const COLORS = isDark ? DARK : LIGHT
const [editMode, setEditMode]         = useState(false)
const [pwMode, setPwMode]             = useState(false)
const [editForm, setEditForm]         = useState({ name: user?.name || '', email: user?.email || '' })
const [pwForm, setPwForm]             = useState({ currentPassword: '', newPassword: '' })
const [showCurrent, setShowCurrent]   = useState(false)
const [showNew, setShowNew]           = useState(false)
const [error, setError]               = useState('')
const [success, setSuccess]           = useState('')
const [loading, setLoading]           = useState(false)
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
const handleUpdateProfile = async () => {
  setError('')
  setLoading(true)
  try {
    const res = await updateProfile(editForm)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setSuccess('Profile updated successfully')
    setEditMode(false)
    setTimeout(() => setSuccess(''), 3000)
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  }
  setLoading(false)
}

const handleChangePassword = async () => {
  setError('')
  setLoading(true)
  try {
    await changePassword(pwForm)
    setSuccess('Password changed successfully')
    setPwMode(false)
    setPwForm({ currentPassword: '', newPassword: '' })
    setTimeout(() => setSuccess(''), 3000)
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  }
  setLoading(false)
}
  return (
    <div style={{
      padding: isDesktop ? '32px 40px 40px' : '24px 20px 100px',
      background: COLORS.bg, minHeight: '100vh', transition: 'background 0.3s',
    }}>
      <h2 style={{
        margin: '0 0 24px', fontSize: 22, fontWeight: 800,
        color: COLORS.text, fontFamily: "'Sora', sans-serif",
      }}>
        Profile
      </h2>

      {/* Desktop layout — two columns */}
      <div style={{
        display: isDesktop ? 'grid' : 'block',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : 'none',
        gap: 24, alignItems: 'start',
      }}>

        {/* Left column — Avatar + Info */}
        <div>
          {/* Avatar */}
          <div style={{
            background: COLORS.card, borderRadius: 20, padding: '24px',
            marginBottom: 16, textAlign: 'center',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: COLORS.teal, margin: '0 auto 12px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff',
              fontSize: 28, fontWeight: 800,
              fontFamily: "'Sora', sans-serif",
            }}>
              {initials}
            </div>
            <h3 style={{
              margin: 0, fontSize: 20, fontWeight: 700,
              color: COLORS.text, fontFamily: "'Sora', sans-serif",
            }}>
              {user?.name}
            </h3>
            <p style={{ color: COLORS.muted, fontSize: 13, margin: '4px 0 8px' }}>
              {user?.email}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: user?.role === 'admin' ? '#FEF3C7' : COLORS.tealLight,
              color: user?.role === 'admin' ? '#D97706' : COLORS.teal,
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            }}>
              {user?.role === 'admin'
                ? <><Crown size={12} /> Admin</>
                : <><User size={12} /> User</>
              }
            </span>
          </div>

          {/* Info Cards */}
          <div style={{
            background: COLORS.card, borderRadius: 20,
            overflow: 'hidden', marginBottom: isDesktop ? 0 : 16,
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            border: `1px solid ${COLORS.border}`,
          }}>
            {[
              { label: 'Full Name',    value: user?.name,  Icon: User   },
              { label: 'Email',        value: user?.email, Icon: Mail   },
              { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Standard User', Icon: Shield },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: COLORS.tealLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <item.Icon size={16} color={COLORS.teal} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Settings + Logout */}

        <div>
          {/* Dark Mode Toggle */}
          <div style={{
            background: COLORS.card, borderRadius: 20,
            padding: '16px', marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: COLORS.tealLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDark
                  ? <Sun size={16} color={COLORS.teal} strokeWidth={2} />
                  : <Moon size={16} color={COLORS.teal} strokeWidth={2} />
                }
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={toggleTheme}
              style={{
                width: 52, height: 28, borderRadius: 14,
                background: isDark ? COLORS.teal : COLORS.border,
                border: 'none', cursor: 'pointer',
                position: 'relative', transition: 'background 0.3s',
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: '#fff',
                position: 'absolute', top: 3,
                left: isDark ? 27 : 3,
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
{/* Edit Profile */}
<div style={{
  background: COLORS.card, borderRadius: 20,
  padding: '16px', marginBottom: 16,
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editMode ? 16 : 0 }}>
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.text }}>Edit Profile</p>
    <button
      onClick={() => { setEditMode(!editMode); setError('') }}
      style={{
        background: editMode ? '#FFF5F5' : COLORS.tealLight,
        border: 'none', borderRadius: 10, padding: '6px 14px',
        color: editMode ? COLORS.red : COLORS.teal,
        fontWeight: 600, fontSize: 12, cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {editMode ? 'Cancel' : 'Edit'}
    </button>
  </div>

  {editMode && (
    <div>
      <input
        placeholder="Full Name"
        value={editForm.name}
        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 12,
          border: `1.5px solid ${COLORS.border}`, marginBottom: 10,
          fontSize: 14, boxSizing: 'border-box', outline: 'none',
          background: COLORS.input, color: COLORS.text,
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      <input
        placeholder="Email"
        type="email"
        value={editForm.email}
        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 12,
          border: `1.5px solid ${COLORS.border}`, marginBottom: 12,
          fontSize: 14, boxSizing: 'border-box', outline: 'none',
          background: COLORS.input, color: COLORS.text,
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        style={{
          width: '100%', padding: '12px', borderRadius: 12,
          border: 'none', background: COLORS.teal, color: '#fff',
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )}
</div>

{/* Change Password */}
<div style={{
  background: COLORS.card, borderRadius: 20,
  padding: '16px', marginBottom: 16,
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
}}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pwMode ? 16 : 0 }}>
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COLORS.text }}>Change Password</p>
    <button
      onClick={() => { setPwMode(!pwMode); setError('') }}
      style={{
        background: pwMode ? '#FFF5F5' : COLORS.tealLight,
        border: 'none', borderRadius: 10, padding: '6px 14px',
        color: pwMode ? COLORS.red : COLORS.teal,
        fontWeight: 600, fontSize: 12, cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {pwMode ? 'Cancel' : 'Change'}
    </button>
  </div>

  {pwMode && (
    <div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input
          placeholder="Current Password"
          type={showCurrent ? 'text' : 'password'}
          value={pwForm.currentPassword}
          onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
          style={{
            width: '100%', padding: '12px 48px 12px 16px', borderRadius: 12,
            border: `1.5px solid ${COLORS.border}`,
            fontSize: 14, boxSizing: 'border-box', outline: 'none',
            background: COLORS.input, color: COLORS.text,
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {showCurrent ? <EyeOff size={16} color={COLORS.muted} /> : <Eye size={16} color={COLORS.muted} />}
        </button>
      </div>
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <input
          placeholder="New Password"
          type={showNew ? 'text' : 'password'}
          value={pwForm.newPassword}
          onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
          style={{
            width: '100%', padding: '12px 48px 12px 16px', borderRadius: 12,
            border: `1.5px solid ${COLORS.border}`,
            fontSize: 14, boxSizing: 'border-box', outline: 'none',
            background: COLORS.input, color: COLORS.text,
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {showNew ? <EyeOff size={16} color={COLORS.muted} /> : <Eye size={16} color={COLORS.muted} />}
        </button>
      </div>
      <button
        onClick={handleChangePassword}
        disabled={loading}
        style={{
          width: '100%', padding: '12px', borderRadius: 12,
          border: 'none', background: COLORS.teal, color: '#fff',
          fontWeight: 700, fontSize: 14, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {loading ? 'Saving...' : 'Update Password'}
      </button>
    </div>
  )}
</div>

{/* Messages */}
{error && <p style={{ color: COLORS.red, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
{success && <p style={{ color: COLORS.green, fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{success}</p>}
          {/* App Info */}
          <div style={{
            background: COLORS.card, borderRadius: 20,
            padding: '16px', marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: COLORS.text }}>About</p>
            {[
              { label: 'App Name',  value: 'FinanceApp'    },
              { label: 'Version',   value: '1.0.0'         },
              { label: 'Platform',  value: 'Web & Mobile'  },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              }}>
                <span style={{ fontSize: 13, color: COLORS.muted }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              width: '100%', padding: '16px', borderRadius: 14,
              border: '1.5px solid #FCA5A5', background: '#FFF5F5',
              color: COLORS.red, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <LogOut size={18} strokeWidth={2} />
            Logout
          </button>
        </div>

      </div>
    </div>
  )
}