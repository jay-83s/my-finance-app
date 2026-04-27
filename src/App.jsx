import { useState, useEffect } from 'react'
import { useFinance } from './hooks/useFinance'
import { useTheme } from './context/ThemeContext'
import { useWindowSize } from './hooks/useWindowSize'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import Dashboard from './screens/Dashboard'
import History from './screens/History'
import Analytics from './screens/Analytics'
import Profile from './screens/Profile'
import Login from './screens/Login'
import Admin from './screens/Admin'

export default function App() {
  const [user, setUser] = useState(null)
  const finance         = useFinance(user?.savings_goal || 20)
  const { isDark }      = useTheme()
  const { isDesktop }   = useWindowSize()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    finance.setScreen('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  if (!user) return <Login onLogin={handleLogin} />
  if (user.role === 'admin') return <Admin onLogout={handleLogout} />

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ── Full-page background image (fixed, behind everything) ── */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: 'url(/sean-pollock-PhYq704ffdA-unsplash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* ── Overlay — lighter in light mode, heavier in dark ── */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: isDark
            ? 'rgba(5, 11, 22, 0.88)'
            : 'rgba(15, 30, 55, 0.72)',
          transition: 'background 0.4s ease',
        }} />

        {/* ── Subtle teal brand glow ── */}
        <div style={{
          position: 'fixed',
          top: '-15%', right: '-8%',
          width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,191,191,0.08) 0%, transparent 65%)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed',
          bottom: '-20%', left: '-10%',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,191,191,0.05) 0%, transparent 65%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* ── Sidebar (desktop) ── */}
        {isDesktop && (
          <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
            <Sidebar
              screen={finance.screen}
              setScreen={finance.setScreen}
              onLogout={handleLogout}
              user={user}
            />
          </div>
        )}

        {/* ── Main content ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 5,
        }}>
          <div style={{
            maxWidth: isDesktop ? 900 : 430,
            margin: '0 auto',
            width: '100%',
          }}>
            {finance.screen === 'dashboard' && <Dashboard finance={finance} user={user} isDesktop={isDesktop} />}
            {finance.screen === 'history'   && <History   finance={finance} isDesktop={isDesktop} />}
            {finance.screen === 'analytics' && <Analytics finance={finance} isDesktop={isDesktop} />}
            {finance.screen === 'profile'   && <Profile   user={user} onLogout={handleLogout} isDesktop={isDesktop} />}

            {!isDesktop && (
              <BottomNav screen={finance.screen} setScreen={finance.setScreen} />
            )}
          </div>
        </div>

      </div>
    </>
  )
}