import { useState, useEffect } from 'react'
import { getAdminUsers, getAdminTransactions, deleteUser } from '../api/index'
import { COLORS } from '../utils/theme'

export default function Admin({ onLogout }) {
  const [activeTab, setActiveTab]       = useState('users')
  const [users, setUsers]               = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)

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

  const totalBalance = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0)
  const totalIncome  = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + parseFloat(t.amount), 0)
  const totalSpent   = Math.abs(transactions.filter(t => t.type === 'debit').reduce((a, t) => a + parseFloat(t.amount), 0))

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: COLORS.muted }}>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 20px 40px', fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Admin Panel</p>
          <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            👑 Dashboard
          </h2>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: '#FFF5F5', border: '1.5px solid #FCA5A5',
            borderRadius: 20, padding: '7px 14px',
            cursor: 'pointer', color: COLORS.red,
            fontWeight: 700, fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Users',    value: users.length,                   icon: '👥', color: COLORS.teal,  bg: COLORS.tealLight },
          { label: 'Income',   value: `${Math.round(totalIncome).toLocaleString()}`, icon: '💰', color: COLORS.green, bg: '#F0FDF4' },
          { label: 'Spent',    value: `${Math.round(totalSpent).toLocaleString()}`,  icon: '💸', color: COLORS.red,   bg: '#FFF5F5' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: stat.bg, borderRadius: 16, padding: '14px 12px',
          }}>
            <span style={{ fontSize: 22 }}>{stat.icon}</span>
            <p style={{ margin: '6px 0 2px', fontSize: 11, color: COLORS.muted }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['users', 'transactions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 20,
              border: `1.5px solid ${activeTab === tab ? COLORS.teal : '#E8EEF4'}`,
              background: activeTab === tab ? COLORS.teal : '#fff',
              color: activeTab === tab ? '#fff' : COLORS.muted,
              fontWeight: 600, cursor: 'pointer', fontSize: 13,
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div style={{ background: COLORS.card, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          {users.map((u, i) => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: i < users.length - 1 ? '1px solid #F0F4F8' : 'none',
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
                <p style={{ margin: '2px 0 0', fontSize: 11, color: COLORS.muted }}>{u.email}</p>
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
                    cursor: 'pointer', color: COLORS.red,
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
        <div style={{ background: COLORS.card, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          {transactions.map((tx, i) => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: i < transactions.length - 1 ? '1px solid #F0F4F8' : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                background: tx.type === 'credit' ? '#F0FDF4' : '#FFF5F5',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18,
              }}>
                {tx.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{tx.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: COLORS.muted }}>
                  {tx.user_name} · {tx.category}
                </p>
              </div>
              <p style={{
                margin: 0, fontSize: 14, fontWeight: 700,
                color: tx.type === 'credit' ? COLORS.green : COLORS.red,
              }}>
                {tx.type === 'credit' ? '+' : '-'}KES {Math.abs(parseFloat(tx.amount)).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}