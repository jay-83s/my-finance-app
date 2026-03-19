import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../utils/theme";
import { formatAmount } from "../utils/currency";
import { monthlyData } from "../data/seedData";
import CurrencySwitcher from "../components/CurrencySwitcher";
import TransactionItem from "../components/TransactionItem";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Dashboard({ finance }) {
  const { transactions, currency, setCurrency, balance, totalExpenses, addTransaction, setScreen } = finance;
  const [showModal, setShowModal] = useState(false);

  const fmtTooltip = (v) => {
    if (currency === "USD") return [`$${(v * 0.00775).toFixed(2)}`, ""];
    return [`KES ${Math.round(v).toLocaleString()}`, ""];
  };

  return (
    <div style={{ padding: "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>Welcome back 👋</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            Claudia
          </h2>
        </div>
        <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
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
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>{formatAmount(100000, currency)}</p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: "0 0 3px" }}>↑ Expenses</p>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>{formatAmount(totalExpenses, currency)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: "20px 16px", marginBottom: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Spending Overview</h3>
          <span style={{ fontSize: 11, color: COLORS.muted, background: "#F0F4F8", padding: "4px 10px", borderRadius: 20 }}>6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={monthlyData} barCategoryGap="30%">
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: COLORS.text, border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
              formatter={fmtTooltip}
            />
            <Bar dataKey="expenses" fill={`${COLORS.teal}30`} radius={[6, 6, 0, 0]} />
            <Bar dataKey="saved"    fill={COLORS.teal}         radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.teal }} />
            <span style={{ fontSize: 11, color: COLORS.muted }}>Saved</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: `${COLORS.teal}30` }} />
            <span style={{ fontSize: 11, color: COLORS.muted }}>Spent</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "📤", label: "Send",      action: () => setScreen("transfer")  },
          { icon: "📥", label: "Receive",   action: () => {}                      },
          { icon: "➕", label: "Add Tx",   action: () => setShowModal(true)      },
          { icon: "📊", label: "Analytics", action: () => setScreen("analytics") },
        ].map(a => (
          <button key={a.label} onClick={a.action} style={{
            flex: 1, background: COLORS.card, border: "1.5px solid #E8EEF4",
            borderRadius: 16, padding: "14px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 22 }}>{a.icon}</span>
            <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div style={{ background: COLORS.card, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 0" }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Recent Transactions</h3>
          <button onClick={() => setScreen("history")} style={{ background: "none", border: "none", color: COLORS.teal, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            See All
          </button>
        </div>
        {transactions.slice(0, 4).map((tx, i) => (
          <TransactionItem
            key={tx.id} tx={tx} currency={currency}
            borderBottom={i < 3}
          />
        ))}
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <AddTransactionModal
          currency={currency}
          setCurrency={setCurrency}
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
