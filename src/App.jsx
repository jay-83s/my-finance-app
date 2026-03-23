import { useState, useEffect } from 'react'
import { useFinance } from './hooks/useFinance'
import BottomNav from './components/BottomNav'
import Dashboard from './screens/Dashboard'
import History from './screens/History'
import Analytics from './screens/Analytics'
import Profile from './screens/Profile'
import Login from './screens/Login'
import Admin from './screens/Admin'

export default function App() {
  const [user, setUser] = useState(null)
  const finance = useFinance()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Show admin dashboard for admin users
  if (user.role === 'admin') {
    return <Admin onLogout={handleLogout} />
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#F5F8FA',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
      }}>
        {finance.screen === 'dashboard' && <Dashboard finance={finance} user={user} />}
        {finance.screen === 'history'   && <History finance={finance} />}
        {finance.screen === 'analytics' && <Analytics finance={finance} />}
        {finance.screen === 'profile'   && <Profile user={user} onLogout={handleLogout} />}

        <BottomNav screen={finance.screen} setScreen={finance.setScreen} />
      </div>
    </>
  )
}