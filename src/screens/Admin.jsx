import { useState, useEffect } from 'react'
import { getAdminUsers, getAdminTransactions, deleteUser } from '../api/index'
import { useTheme } from '../context/ThemeContext'
import { LIGHT, DARK } from '../utils/theme'
import { Users, ArrowUpDown, TrendingUp, PiggyBank, TrendingDown, LogOut } from 'lucide-react'

const TYPE_STYLES = {
  income:             { color: '#22C55E', bg: '#F0FDF4', sign: '+', label: 'Income'    },
  savings:            { color: '#6366F1', bg: '#EEF2FF', sign: '→', label: 'Savings'   },
  expense:            { color: '#EF4444', bg: '#FFF5F5', sign: '-', label: 'Expense'   },
  savings_withdrawal: { color: '#F59E0B', bg: '#FFFBEB', sign: '↩', label: 'Withdrawal'},
}

export default function Admin({ onLogout }) {
  const [activeTab, setActiveTab]       = useState('users')
  const [users, setUsers]               = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')

  const { isDark } = useTheme()
  const COLORS = isDark ? DARK : LIGHT

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, txRes] = await Promise.all([
        getAdminUsers(),
        getAdminTransactions(),
      ])
      setUsers(usersRes.data)
      setTransactions(txRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  // Correct stats using new types
  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((a, t) => a + parseFloat(t.amount), 0)
  const totalSavings  = transactions.filter(t => t.type === 'savings').reduce((a, t) => a + parseFloat(t.amount), 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + parseFloat(t.amount), 0)

  // Filter transactions by search
  const filteredTx = transactions.filter(tx =>
    tx.label?.toLowerCase().includes(search.toLowerCase()) ||
    tx.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.category?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: COLORS.bg }}>
        <p style={{ color: COLORS.muted }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.3s' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{
        background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`,
        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: COLORS.teal, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18 }}>💰</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>Admin Panel</p>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
              FinanceApp Dashboard
            </h2>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: '#FFF5F5', border: '1.5px solid #FCA5A5',
            borderRadius: 20, padding: '7px 14px',
            cursor: 'pointer', color: '#EF4444',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Users',    value: users.length,                              icon: <Users size={20} color='#fff' />,        color: COLORS.teal,  bg: COLORS.tealLight  },
            { label: 'Total Income',   value: `KES ${Math.round(totalIncome).toLocaleString()}`,   icon: <TrendingUp size={20} color='#fff' />,   color: '#22C55E', bg: '#F0FDF4' },
            { label: 'Total Savings',  value: `KES ${Math.round(totalSavings).toLocaleString()}`,  icon: <PiggyBank size={20} color='#fff' />,    color: '#6366F1', bg: '#EEF2FF' },
            { label: 'Total Expenses', value: `KES ${Math.round(totalExpenses).toLocaleString()}`, icon: <TrendingDown size={20} color='#fff' />, color: '#EF4444', bg: '#FFF5F5' },
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: 16, padding: '16px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                {stat.icon}
              </div>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: '#8A9BB0' }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'users',        icon: <Users size={14} />,       label: 'Users'        },
              { id: 'transactions', icon: <ArrowUpDown size={14} />, label: 'Transactions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch('') }}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  border: `1.5px solid ${activeTab === tab.id ? COLORS.teal : COLORS.border}`,
                  background: activeTab === tab.id ? COLORS.teal : COLORS.card,
                  color: activeTab === tab.id ? '#fff' : COLORS.muted,
                  fontWeight: 600, cursor: 'pointer', fontSize: 13,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {tab.icon} {tab.label}
                <span style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : COLORS.tealLight,
                  color: activeTab === tab.id ? '#fff' : COLORS.teal,
                  borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700,
                }}>
                  {tab.id === 'users' ? users.length : transactions.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 16px', borderRadius: 20,
              border: `1.5px solid ${COLORS.border}`,
              background: COLORS.card, color: COLORS.text,
              fontSize: 13, outline: 'none', width: 200,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div style={{ background: COLORS.card, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: `1px solid ${COLORS.border}` }}>
            {filteredUsers.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <p style={{ color: COLORS.muted }}>No users found</p>
              </div>
            ) : filteredUsers.map((u, i) => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderBottom: i < filteredUsers.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: COLORS.teal, flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff',
                  fontWeight: 700, fontSize: 14,
                }}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{u.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: COLORS.muted }}>{u.email} · Savings goal: {u.savings_goal || 20}%</p>
                </div>
                <span style={{
                  background: u.role === 'admin' ? '#FEF3C7' : COLORS.tealLight,
                  color: u.role === 'admin' ? '#D97706' : COLORS.teal,
                  padding: '3px 10px', borderRadius: 20,
                  fontSize: 11, fontWeight: 700,
                }}>
                  {u.role}
                </span>
                {u.role !== 'admin' && (
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    style={{
                      background: '#FFF5F5', border: '1.5px solid #FCA5A5',
                      borderRadius: 8, padding: '6px 10px',
                      cursor: 'pointer', color: '#EF4444',
                      fontSize: 12, fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === 'transactions' && (
          <div style={{ background: COLORS.card, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: `1px solid ${COLORS.border}` }}>
            {filteredTx.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <p style={{ color: COLORS.muted }}>No transactions found</p>
              </div>
            ) : filteredTx.map((tx, i) => {
              const style = TYPE_STYLES[tx.type] || TYPE_STYLES.expense
              return (
                <div key={tx.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderBottom: i < filteredTx.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                    background: style.bg,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 18,
                  }}>
                    {tx.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{tx.label}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 20, background: style.bg, color: style.color,
                      }}>
                        {style.label}
                      </span>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>
                        {tx.user_name} · {tx.category} · {tx.date?.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 14, fontWeight: 700,
                    color: style.color,
                  }}>
                    {style.sign} KES {Math.abs(parseFloat(tx.amount)).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}