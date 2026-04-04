import { Plus, BarChart2, ArrowUpDown, User } from "lucide-react"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { COLORS } from "../utils/theme"
import { formatAmount } from "../utils/currency"
import CurrencySwitcher from "../components/CurrencySwitcher"
import TransactionItem from "../components/TransactionItem"
import AddTransactionModal from "../components/AddTransactionModal"

export default function Dashboard({ finance, user }) {
  const { transactions, currency, setCurrency, balance, totalExpenses, totalIncome, addTransaction, setScreen } = finance
  const [showModal, setShowModal]     = useState(false)
  const [chartRange, setChartRange]   = useState("3M")
  const savingsGoalPct = user?.savings_goal || 20

  const fmtTooltip = (v) => {
    if (currency === "USD") return [`$${(v * 0.00775).toFixed(2)}`, ""]
    return [`KES ${Math.round(v).toLocaleString()}`, ""]
  }

  // Build full monthly chart data from all transactions
  const allMonthlyMap = transactions.reduce((acc, t) => {
    const date  = new Date(t.date)
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const label = date.toLocaleString("default", { month: "short", year: "2-digit" })
    if (!acc[key]) acc[key] = { month: label, expenses: 0, saved: 0, key }
    if (t.type === "expense") acc[key].expenses += parseFloat(t.amount)
    if (t.type === "savings") acc[key].saved    += parseFloat(t.amount)
    return acc
  }, {})

  // Sort by date
  const allChartData = Object.values(allMonthlyMap)
    .sort((a, b) => a.key.localeCompare(b.key))

  // Filter based on selected range
  const now        = new Date()
  const monthsBack = chartRange === "3M" ? 3 : chartRange === "6M" ? 6 : 12

  const filteredChartData = allChartData.filter(d => {
    const [year, month] = d.key.split("-").map(Number)
    const dataDate = new Date(year, month - 1)
    const cutoff   = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1)
    return dataDate >= cutoff
  })

  return (
    <div style={{ padding: "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Welcome back 👋</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            {user?.name || "User"}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
          <button
            onClick={() => setScreen("profile")}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: COLORS.teal, border: "none",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 15,
              fontFamily: "'Sora', sans-serif", flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.teal} 0%, #0A9494 50%, #077070 100%)`,
        borderRadius: 24, padding: "28px 24px", marginBottom: 20,
        boxShadow: `0 12px 40px ${COLORS.teal}55`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "0 0 6px", letterSpacing: 1, textTransform: "uppercase" }}>
              Total Balance
            </p>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: "0 0 20px", fontFamily: "'Sora', sans-serif" }}>
              {formatAmount(balance, currency)}
            </h1>
          </div>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} compact />
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "0 0 3px" }}>↓ Income</p>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>
              {formatAmount(totalIncome, currency)}
            </p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "0 0 3px" }}>↑ Expenses</p>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>
              {formatAmount(totalExpenses, currency)}
            </p>
          </div>
        </div>
      </div>
      {/* Pay Yourself First Card */}
{monthlyIncome > 0 && (
  <div style={{
    background: canSpend ? '#F0FDF4' : '#FFF5F5',
    border: `1.5px solid ${canSpend ? COLORS.green : COLORS.red}`,
    borderRadius: 20, padding: '16px 20px', marginBottom: 20,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: canSpend ? COLORS.green : COLORS.red }}>
          {canSpend ? '✅ Savings target met!' : '⚠️ Save before you spend'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: COLORS.muted }}>
          {savingsGoalPct}% savings goal this month
        </p>
      </div>
      <span style={{
        background: canSpend ? COLORS.green : COLORS.red,
        color: '#fff', fontSize: 11, fontWeight: 700,
        padding: '4px 10px', borderRadius: 20,
      }}>
        {canSpend ? 'Ready to spend' : `Save ${formatAmount(remainingToSave, currency)} more`}
      </span>
    </div>

    {/* Progress bar */}
    <div style={{ height: 8, background: 'rgba(0,0,0,0.08)', borderRadius: 4, marginBottom: 12 }}>
      <div style={{
        height: '100%', borderRadius: 4,
        background: canSpend ? COLORS.green : COLORS.red,
        width: `${Math.min(100, (monthlySavings / requiredSavings) * 100)}%`,
        transition: 'width 0.5s',
      }} />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {[
        { label: 'Monthly Income',   value: monthlyIncome,    color: COLORS.green },
        { label: 'Required Savings', value: requiredSavings,  color: '#6366F1'    },
        { label: 'Available Spend',  value: availableToSpend, color: COLORS.teal  },
      ].map(item => (
        <div key={item.label} style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: item.color }}>
            {formatAmount(item.value, currency)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: COLORS.muted }}>{item.label}</p>
        </div>
      ))}
    </div>
  </div>
)}
      {/* Chart */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: "20px 16px", marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Spending Overview</h3>
          <div style={{ display: "flex", gap: 6 }}>
            {["3M", "6M", "1Y"].map(r => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                style={{
                  padding: "4px 10px", borderRadius: 20, fontSize: 11,
                  border: `1.5px solid ${chartRange === r ? COLORS.teal : "#E8EEF4"}`,
                  background: chartRange === r ? COLORS.tealLight : "#fff",
                  color: chartRange === r ? COLORS.teal : COLORS.muted,
                  fontWeight: 600, cursor: "pointer",
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
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: COLORS.text, border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
                  formatter={fmtTooltip}
                />
                <Bar dataKey="expenses" fill={`${COLORS.red}50`} radius={[6, 6, 0, 0]} />
                <Bar dataKey="saved"    fill={COLORS.teal}        radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.teal }} />
                <span style={{ fontSize: 11, color: COLORS.muted }}>Saved</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: `${COLORS.red}50` }} />
                <span style={{ fontSize: 11, color: COLORS.muted }}>Spent</span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ color: COLORS.muted, fontSize: 13 }}>No data for this period yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { icon: Plus,        label: "Add Entry", action: () => setShowModal(true)      },
          { icon: BarChart2,   label: "Analytics", action: () => setScreen("analytics")  },
         
        ].map(a => {
          const Icon = a.icon
          return (
            <button key={a.label} onClick={a.action} style={{
              flex: 1, background: COLORS.card, border: "1.5px solid #E8EEF4",
              borderRadius: 16, padding: "14px 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <Icon size={22} color={COLORS.teal} strokeWidth={1.8} />
              <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{a.label}</span>
            </button>
          )
        })}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: COLORS.card, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 0" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Recent Transactions</h3>
          <button onClick={() => setScreen("history")} style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            See All
          </button>
        </div>
        {transactions.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center" }}>
            <p style={{ color: COLORS.muted, fontSize: 13 }}>No transactions yet. Add your first entry!</p>
          </div>
        ) : (
          transactions.slice(0, 4).map((tx, i) => (
            <TransactionItem
              key={tx.id} tx={tx} currency={currency}
              borderBottom={i < 3}
            />
          ))
        )}
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal
          currency={currency}
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}