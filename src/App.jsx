import { useState, useEffect } from 'react'
import { useFinance } from './hooks/useFinance'
import { useTheme } from './context/ThemeContext'
import { useWindowSize } from './hooks/useWindowSize'
import { LIGHT, DARK } from './utils/theme'
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
  const finance         = useFinance()
  const { isDark }      = useTheme()
  const { isDesktop }   = useWindowSize()
  const COLORS          = isDark ? DARK : LIGHT

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const handleLogin  = (userData) => setUser(userData)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
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
        background: COLORS.bg,
        fontFamily: "'DM Sans', sans-serif",
        transition: 'background 0.3s',
      }}>

        {/* Sidebar — desktop only */}
        {isDesktop && (
          <Sidebar screen={finance.screen} setScreen={finance.setScreen} />
        )}

        {/* Main content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: '100vh',
          background: COLORS.bg,
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

            {/* Bottom nav — mobile only */}
            {!isDesktop && (
              <BottomNav screen={finance.screen} setScreen={finance.setScreen} />
            )}
          </div>
        </div>

      </div>
    </>
  )
}