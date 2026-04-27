import { updateSavingsGoal, updateProfile, changePassword } from '../api/index'
import { useState } from 'react'
import { User, Mail, Shield, LogOut, Crown, Moon, Sun, Eye, EyeOff, PiggyBank } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const glass = (isDark) => ({
  background: isDark ? 'rgba(5,15,30,0.6)' : 'rgba(8,20,45,0.48)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
})

const glassInput = (isDark) => ({
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: '1.5px solid rgba(255,255,255,0.09)', marginBottom: 10,
  fontSize: 14, boxSizing: 'border-box', outline: 'none',
  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
  color: '#E8F4FF',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s',
})

export default function Profile({ user, onLogout, isDesktop }) {
  const { isDark, toggleTheme } = useTheme()

  const [editMode, setEditMode]       = useState(false)
  const [pwMode, setPwMode]           = useState(false)
  const [editForm, setEditForm]       = useState({ name: user?.name || '', email: user?.email || '' })
  const [pwForm, setPwForm]           = useState({ currentPassword: '', newPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [goalValue, setGoalValue]     = useState(user?.savings_goal || 20)
  const [goalSuccess, setGoalSuccess] = useState('')
  const [goalLoading, setGoalLoading] = useState(false)

  const textColor  = '#F0F7FF'
  const mutedColor = 'rgba(180,220,240,0.5)'
  const teal       = '#0BBFBF'

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleUpdateGoal = async () => {
    setGoalLoading(true)
    try {
      const res = await updateSavingsGoal({ savings_goal: goalValue })
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setGoalSuccess('Savings goal updated!')
      setTimeout(() => setGoalSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setGoalLoading(false)
  }

  const handleUpdateProfile = async () => {
    setError(''); setLoading(true)
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
    setError(''); setLoading(true)
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

  const Card = ({ children, style = {} }) => (
    <div style={{ ...glass(isDark), borderRadius: 20, padding: '18px', marginBottom: 14, ...style }}>
      {children}
    </div>
  )

  const sectionLabel = (text) => (
    <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: textColor }}>{text}</p>
  )

  return (
    <>
      <style>{`
        .prof-input:focus {
          border-color: rgba(11,191,191,0.6) !important;
          background: rgba(255,255,255,0.09) !important;
        }
        .prof-input::placeholder { color: rgba(180,210,240,0.32); }
      `}</style>

      <div style={{ padding: isDesktop ? '32px 40px 60px' : '24px 20px 100px' }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          position: 'relative', borderRadius: 24, overflow: 'hidden',
          marginBottom: 20, minHeight: 160,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '28px 24px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1600&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: isDark
              ? 'linear-gradient(135deg, rgba(4,12,24,0.88) 0%, rgba(4,12,24,0.65) 100%)'
              : 'linear-gradient(135deg, rgba(4,12,24,0.78) 0%, rgba(4,12,24,0.52) 100%)',
            zIndex: 1,
          }} />
          {/* Teal glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 80% 20%, rgba(11,191,191,0.15) 0%, transparent 65%)',
            zIndex: 2,
          }} />
          <div style={{ position: 'relative', zIndex: 3, display: 'flex', alignItems: 'flex-end', gap: 18 }}>
            {/* Avatar */}
            <div style={{
              width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 26, fontWeight: 800,
              fontFamily: "'Sora', sans-serif",
              border: '3px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 20px rgba(11,191,191,0.45)',
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: textColor, fontFamily: "'Sora', sans-serif" }}>
                {user?.name}
              </h2>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: mutedColor }}>{user?.email}</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: user?.role === 'admin' ? 'rgba(251,191,36,0.18)' : 'rgba(11,191,191,0.18)',
                color: user?.role === 'admin' ? '#FBBF24' : '#0BBFBF',
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                border: `1px solid ${user?.role === 'admin' ? 'rgba(251,191,36,0.3)' : 'rgba(11,191,191,0.3)'}`,
              }}>
                {user?.role === 'admin' ? <><Crown size={11} /> Admin</> : <><User size={11} /> User</>}
              </span>
            </div>
          </div>
        </div>

        {/* ── GRID LAYOUT ── */}
        <div style={{
          display: isDesktop ? 'grid' : 'block',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : 'none',
          gap: 20, alignItems: 'start',
        }}>

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Account Info */}
            <Card>
              {sectionLabel('Account Info')}
              {[
                { label: 'Full Name',    value: user?.name,  Icon: User   },
                { label: 'Email',        value: user?.email, Icon: Mail   },
                { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Standard User', Icon: Shield },
              ].map((item, i, arr) => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'rgba(11,191,191,0.15)',
                    border: '1px solid rgba(11,191,191,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.Icon size={15} color={teal} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: mutedColor }}>{item.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: textColor }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Savings Goal */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'rgba(11,191,191,0.15)',
                  border: '1px solid rgba(11,191,191,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PiggyBank size={15} color={teal} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor }}>Savings Goal</p>
                  <p style={{ margin: 0, fontSize: 11, color: mutedColor }}>% of income to save first</p>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: mutedColor }}>1%</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: teal, fontFamily: "'Sora', sans-serif" }}>
                    {goalValue}%
                  </span>
                  <span style={{ fontSize: 12, color: mutedColor }}>100%</span>
                </div>
                <input
                  type="range" min="1" max="100" value={goalValue}
                  onChange={e => setGoalValue(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: teal }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  {[10, 20, 30, 50].map(v => (
                    <button key={v} onClick={() => setGoalValue(v)} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 11,
                      border: `1.5px solid ${goalValue === v ? teal : 'rgba(255,255,255,0.12)'}`,
                      background: goalValue === v ? 'rgba(11,191,191,0.2)' : 'rgba(255,255,255,0.05)',
                      color: goalValue === v ? teal : mutedColor,
                      cursor: 'pointer', fontWeight: 600,
                    }}>{v}%</button>
                  ))}
                </div>
              </div>

              {goalSuccess && (
                <p style={{ color: '#34D399', fontSize: 12, margin: '0 0 8px', textAlign: 'center' }}>{goalSuccess}</p>
              )}

              <button onClick={handleUpdateGoal} disabled={goalLoading} style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                opacity: goalLoading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(11,191,191,0.35)',
              }}>
                {goalLoading ? 'Saving...' : 'Update Savings Goal'}
              </button>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>

            {/* Dark Mode Toggle */}
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'rgba(11,191,191,0.15)', border: '1px solid rgba(11,191,191,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDark
                    ? <Sun size={15} color={teal} strokeWidth={2} />
                    : <Moon size={15} color={teal} strokeWidth={2} />}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: textColor }}>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: mutedColor }}>
                    {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <button onClick={toggleTheme} style={{
                width: 52, height: 28, borderRadius: 14,
                background: isDark ? teal : 'rgba(255,255,255,0.15)',
                border: `1px solid ${isDark ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, left: isDark ? 27 : 3,
                  transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }} />
              </button>
            </Card>

            {/* Edit Profile */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editMode ? 14 : 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor }}>Edit Profile</p>
                <button onClick={() => { setEditMode(!editMode); setError('') }} style={{
                  background: editMode ? 'rgba(248,113,113,0.15)' : 'rgba(11,191,191,0.15)',
                  border: `1px solid ${editMode ? 'rgba(248,113,113,0.3)' : 'rgba(11,191,191,0.3)'}`,
                  borderRadius: 10, padding: '5px 14px',
                  color: editMode ? '#F87171' : teal,
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editMode && (
                <div>
                  <input className="prof-input" placeholder="Full Name"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    style={glassInput(isDark)} />
                  <input className="prof-input" placeholder="Email" type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    style={glassInput(isDark)} />
                  <button onClick={handleUpdateProfile} disabled={loading} style={{
                    width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
                    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 16px rgba(11,191,191,0.35)',
                  }}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </Card>

            {/* Change Password */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pwMode ? 14 : 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor }}>Change Password</p>
                <button onClick={() => { setPwMode(!pwMode); setError('') }} style={{
                  background: pwMode ? 'rgba(248,113,113,0.15)' : 'rgba(11,191,191,0.15)',
                  border: `1px solid ${pwMode ? 'rgba(248,113,113,0.3)' : 'rgba(11,191,191,0.3)'}`,
                  borderRadius: 10, padding: '5px 14px',
                  color: pwMode ? '#F87171' : teal,
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {pwMode ? 'Cancel' : 'Change'}
                </button>
              </div>
              {pwMode && (
                <div>
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <input className="prof-input" placeholder="Current Password"
                      type={showCurrent ? 'text' : 'password'}
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      style={{ ...glassInput(isDark), marginBottom: 0, paddingRight: 48 }} />
                    <button onClick={() => setShowCurrent(!showCurrent)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                      {showCurrent ? <EyeOff size={16} color={mutedColor} /> : <Eye size={16} color={mutedColor} />}
                    </button>
                  </div>
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <input className="prof-input" placeholder="New Password"
                      type={showNew ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      style={{ ...glassInput(isDark), marginBottom: 0, paddingRight: 48 }} />
                    <button onClick={() => setShowNew(!showNew)} style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}>
                      {showNew ? <EyeOff size={16} color={mutedColor} /> : <Eye size={16} color={mutedColor} />}
                    </button>
                  </div>
                  <button onClick={handleChangePassword} disabled={loading} style={{
                    width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
                    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 4px 16px rgba(11,191,191,0.35)',
                  }}>
                    {loading ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              )}
            </Card>

            {/* Messages */}
            {error   && <p style={{ color: '#F87171', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: '#34D399', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{success}</p>}

            {/* About */}
            <Card>
              {sectionLabel('About')}
              {[
                { label: 'App Name', value: 'FinanceApp'   },
                { label: 'Version',  value: '1.0.0'        },
                { label: 'Platform', value: 'Web & Mobile' },
              ].map((item, i, arr) => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: mutedColor }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{item.value}</span>
                </div>
              ))}
            </Card>

            {/* Logout */}
            <button onClick={onLogout} style={{
              width: '100%', padding: '15px', borderRadius: 14,
              border: '1px solid rgba(248,113,113,0.3)',
              background: 'rgba(248,113,113,0.1)',
              backdropFilter: 'blur(10px)',
              color: '#F87171', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
              <LogOut size={18} strokeWidth={2} />
              Logout
            </button>

          </div>
        </div>
      </div>
    </>
  )
}