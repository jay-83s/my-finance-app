import { Plus, BarChart2 } from "lucide-react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useTheme } from "../context/ThemeContext"
import { formatAmount } from "../utils/currency"
import CurrencySwitcher from "../components/CurrencySwitcher"
import TransactionItem from "../components/TransactionItem"
import AddTransactionModal from "../components/AddTransactionModal"

// Glass card style — used across every section
const glass = (accent = false) => ({
  background: accent
    ? 'linear-gradient(135deg, rgba(20,184,166,0.22) 0%, rgba(16,185,129,0.14) 100%)'
    : 'rgba(6, 16, 32, 0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${accent ? 'rgba(20,184,166,0.35)' : 'rgba(255,255,255,0.08)'}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
})

export default function Dashboard({ finance, user, isDesktop }) {
  const {
    transactions, currency, setCurrency, balance,
    totalExpenses, totalIncome, addTransaction, setScreen,
    monthlyIncome, monthlySavings,
    remainingToSave, canSpend, availableToSpend,
    isLowFunds, isNoFunds, spendingBudget,
    totalSavingsAvailable
  } = finance

  const { isDark } = useTheme()
  const [showModal, setShowModal]   = useState(false)
  const [chartRange, setChartRange] = useState("3M")
  const savingsGoalPct = user?.savings_goal || 20

  const fmtTooltip = (v) => {
    if (currency === "USD") return [`$${(v * 0.00775).toFixed(2)}`, ""]
    return [`KES ${Math.round(v).toLocaleString()}`, ""]
  }

  const allMonthlyMap = transactions.reduce((acc, t) => {
    const date  = new Date(t.date)
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const label = date.toLocaleString("default", { month: "short", year: "2-digit" })
    if (!acc[key]) acc[key] = { month: label, expenses: 0, saved: 0, key }
    if (t.type === "expense") acc[key].expenses += parseFloat(t.amount)
    if (t.type === "savings") acc[key].saved    += parseFloat(t.amount)
    return acc
  }, {})

  const allChartData     = Object.values(allMonthlyMap).sort((a, b) => a.key.localeCompare(b.key))
  const now              = new Date()
  const monthsBack       = chartRange === "3M" ? 3 : chartRange === "6M" ? 6 : 12
  const filteredChartData = allChartData.filter(d => {
    const [year, month] = d.key.split("-").map(Number)
    const dataDate = new Date(year, month - 1)
    const cutoff   = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1)
    return dataDate >= cutoff
  })

  // Status colors for Pay Yourself First
  const statusColor = isNoFunds ? '#F87171' : isLowFunds ? '#FBBF24' : canSpend ? '#34D399' : '#F87171'
  const statusBg    = isNoFunds ? 'rgba(248,113,113,0.12)' : isLowFunds ? 'rgba(251,191,36,0.10)' : canSpend ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.12)'
  const statusBorder = isNoFunds ? 'rgba(248,113,113,0.3)' : isLowFunds ? 'rgba(251,191,36,0.3)' : canSpend ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-card { animation: fadeUp 0.4s ease both; }
        .dash-card:nth-child(1) { animation-delay: 0.05s; }
        .dash-card:nth-child(2) { animation-delay: 0.10s; }
        .dash-card:nth-child(3) { animation-delay: 0.15s; }
        .dash-card:nth-child(4) { animation-delay: 0.20s; }
        .dash-card:nth-child(5) { animation-delay: 0.25s; }
        .quick-action-btn:hover {
          background: rgba(20,184,166,0.18) !important;
          border-color: rgba(20,184,166,0.5) !important;
          transform: translateY(-2px);
        }
        .quick-action-btn { transition: all 0.2s ease !important; }
      `}</style>

      <div style={{ padding: isDesktop ? "32px 40px 60px" : "24px 20px 100px" }}>

        {/* ── HEADER ── */}
        <div className="dash-card" style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 20,
        }}>
          <div>
            <p style={{ color: 'rgba(180,220,240,0.55)', fontSize: 13, margin: 0 }}>
              Welcome back 👋
            </p>
            <h2 style={{
              margin: "4px 0 0", fontSize: 22, fontWeight: 700,
              color: "#F0F7FF",
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              {user?.name || "User"}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
            <button
              onClick={() => setScreen("profile")}
              style={{
                width: 42, height: 42, borderRadius: "50%",
                background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                border: "2px solid rgba(255,255,255,0.15)",
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 15,
                fontFamily: "'Sora', sans-serif", flexShrink: 0,
                boxShadow: '0 4px 16px rgba(20,184,166,0.45)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

        {/* ── BALANCE CARD ── */}
        <div className="dash-card" style={{
          ...glass(false),
          borderRadius: 24, padding: "28px 24px", marginBottom: 16,
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative teal glow top-right */}
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)",
            pointerEvents: 'none',
          }} />
          <div style={{
            position: "absolute", bottom: -30, left: -20,
            width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            pointerEvents: 'none',
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{
                color: "rgba(180,220,240,0.5)", fontSize: 11,
                margin: "0 0 8px", letterSpacing: 1.5,
                textTransform: "uppercase", fontWeight: 600,
              }}>
                Total Balance
              </p>
              <h1 style={{
                color: "#fff", fontSize: 36, fontWeight: 800,
                margin: "0 0 24px",
                fontFamily: "'Sora', sans-serif",
                textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              }}>
                {formatAmount(balance, currency)}
              </h1>
            </div>
            <CurrencySwitcher currency={currency} setCurrency={setCurrency} compact />
          </div>

          <div style={{ display: "flex", gap: 0 }}>
            {[
              { label: '↓ Income',   value: formatAmount(totalIncome, currency),   color: '#34D399' },
              { label: '↑ Expenses', value: formatAmount(totalExpenses, currency),  color: '#F87171' },
            ].map((item, i) => (
              <div key={item.label} style={{
                flex: 1,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                paddingLeft: i > 0 ? 24 : 0,
              }}>
                <p style={{ color: 'rgba(180,220,240,0.45)', fontSize: 11, margin: "0 0 3px" }}>
                  {item.label}
                </p>
                <p style={{ color: item.color, fontSize: 15, fontWeight: 700, margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PAY YOURSELF FIRST CARD ── */}
        {monthlyIncome > 0 && (
          <div className="dash-card" style={{
            background: statusBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${statusBorder}`,
            borderRadius: 20, padding: '18px 20px', marginBottom: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: statusColor }}>
                  {isNoFunds
                    ? '🚫 Insufficient funds'
                    : !canSpend
                    ? '⚠️ Save before you spend'
                    : isLowFunds
                    ? '⚠️ Running low on funds!'
                    : '✅ Savings target met!'}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(180,220,240,0.5)' }}>
                  {isNoFunds
                    ? 'Kindly top up your account to continue spending'
                    : !canSpend
                    ? 'Save first to unlock spending'
                    : isLowFunds
                    ? 'Less than 5% remaining — spend wisely'
                    : `${savingsGoalPct}% savings goal · You are on track`}
                </p>
              </div>
              <span style={{
                background: statusColor,
                color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '4px 12px', borderRadius: 20, flexShrink: 0,
                boxShadow: `0 2px 12px ${statusColor}55`,
              }}>
                {isNoFunds ? 'No funds' : !canSpend ? `Save ${formatAmount(remainingToSave, currency)} more` : isLowFunds ? 'Low funds!' : 'Ready'}
              </span>
            </div>

            {/* Warning banners */}
            {isNoFunds && (
              <div style={{
                background: 'rgba(248,113,113,0.15)', borderRadius: 10,
                padding: '10px 14px', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid rgba(248,113,113,0.2)',
              }}>
                <span style={{ fontSize: 16 }}>🚫</span>
                <p style={{ margin: 0, fontSize: 12, color: '#FCA5A5', fontWeight: 600 }}>
                  You have used all your spending budget. Top up or move some savings to spending.
                </p>
              </div>
            )}

            {isLowFunds && !isNoFunds && (
              <div style={{
                background: 'rgba(251,191,36,0.12)', borderRadius: 10,
                padding: '10px 14px', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid rgba(251,191,36,0.2)',
              }}>
                <span style={{ fontSize: 16 }}>💸</span>
                <p style={{ margin: 0, fontSize: 12, color: '#FCD34D', fontWeight: 600 }}>
                  Less than 5% of your spending budget remains. Spend wisely!
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, marginBottom: 14 }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${statusColor}, ${statusColor}99)`,
                width: `${Math.min(100, spendingBudget > 0 ? (availableToSpend / spendingBudget) * 100 : 0)}%`,
                transition: 'width 0.5s ease',
                boxShadow: `0 0 8px ${statusColor}66`,
              }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Monthly Income',  value: monthlyIncome,    color: '#34D399' },
                { label: 'Auto Saved',      value: monthlySavings,   color: '#818CF8' },
                { label: 'Available Spend', value: availableToSpend, color: isNoFunds ? '#F87171' : '#2DD4BF' },
              ].map(item => (
                <div key={item.label} style={{
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10, padding: '8px 4px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: item.color }}>
                    {formatAmount(item.value, currency)}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 10, color: 'rgba(180,220,240,0.4)' }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHART CARD ── */}
        <div className="dash-card" style={{
          ...glass(false),
          borderRadius: 20, padding: "20px 18px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F0F7FF' }}>
              Spending Overview
            </h3>
            <div style={{ display: "flex", gap: 6 }}>
              {["3M", "6M", "1Y"].map(r => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 11,
                    border: `1.5px solid ${chartRange === r ? '#14B8A6' : 'rgba(255,255,255,0.1)'}`,
                    background: chartRange === r ? 'rgba(20,184,166,0.2)' : 'transparent',
                    color: chartRange === r ? '#2DD4BF' : 'rgba(180,220,240,0.4)',
                    fontWeight: 600, cursor: "pointer",
                    transition: 'all 0.2s',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {filteredChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={filteredChartData} barCategoryGap="30%">
                  <XAxis
                    dataKey="month" axisLine={false} tickLine={false}
                    tick={{ fill: 'rgba(180,220,240,0.4)', fontSize: 11 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(6,16,32,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, color: '#fff', fontSize: 12,
                    }}
                    formatter={fmtTooltip}
                  />
                  <Bar dataKey="expenses" fill="rgba(248,113,113,0.45)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="saved"    fill="#14B8A6"                 radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {[
                  { label: 'Saved', color: '#14B8A6' },
                  { label: 'Spent', color: 'rgba(248,113,113,0.7)' },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                    <span style={{ fontSize: 11, color: 'rgba(180,220,240,0.45)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: 'rgba(180,220,240,0.35)', fontSize: 13 }}>
                No data for this period yet
              </p>
            </div>
          )}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="dash-card" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {[
            { icon: Plus,      label: "Add Entry",  action: () => setShowModal(true)     },
            { icon: BarChart2, label: "Analytics",  action: () => setScreen("analytics") },
          ].map(a => {
            const Icon = a.icon
            return (
              <button
                key={a.label}
                className="quick-action-btn"
                onClick={a.action}
                style={{
                  flex: 1,
                  ...glass(false),
                  borderRadius: 16, padding: "16px 8px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(20,184,166,0.15)',
                  border: '1px solid rgba(20,184,166,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="#14B8A6" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(180,220,240,0.6)', fontWeight: 600 }}>
                  {a.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── RECENT TRANSACTIONS ── */}
        <div className="dash-card" style={{
          ...glass(false),
          borderRadius: 20, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "18px 18px 0",
          }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F0F7FF' }}>
              Recent Transactions
            </h3>
            <button
              onClick={() => setScreen("history")}
              style={{
                background: 'rgba(20,184,166,0.12)',
                border: '1px solid rgba(20,184,166,0.25)',
                color: '#2DD4BF', fontSize: 12,
                cursor: "pointer", fontWeight: 700,
                padding: '4px 12px', borderRadius: 20,
              }}
            >
              See All
            </button>
          </div>

          {transactions.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <p style={{ color: 'rgba(180,220,240,0.35)', fontSize: 13 }}>
                No transactions yet. Add your first entry!
              </p>
            </div>
          ) : (
            transactions.slice(0, 4).map((tx, i) => (
              <TransactionItem
                key={tx.id} tx={tx} currency={currency}
                borderBottom={i < Math.min(3, transactions.length - 1)}
              />
            ))
          )}
        </div>

      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal
          currency={currency}
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
          finance={{
            savingsGoalPct: user?.savings_goal || 20,
            totalSavingsAvailable: finance.totalSavingsAvailable,
          }}
        />
      )}
    </>
  )
}