import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { LIGHT, DARK } from "../utils/theme"
import CurrencySwitcher from "../components/CurrencySwitcher"
import TransactionItem from "../components/TransactionItem"

export default function History({ finance, isDesktop }) {
  const { transactions, currency, setCurrency } = finance
  const { isDark } = useTheme()
  const COLORS = isDark ? DARK : LIGHT

  const [filterCat, setFilterCat] = useState("All")

  const categories = ["All", ...Array.from(new Set(transactions.map(t => t.category)))]
  const filtered   = filterCat === "All" ? transactions : transactions.filter(t => t.category === filterCat)

  return (
    <div style={{ padding: isDesktop ? "32px 40px 40px" : "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{
          margin: 0, fontSize: 22, fontWeight: 800,
          color: COLORS.text, fontFamily: "'Sora', sans-serif",
        }}>
          Transactions
        </h2>
        <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            style={{
              padding: "8px 16px", borderRadius: 20,
              border: `1.5px solid ${filterCat === c ? COLORS.teal : COLORS.border}`,
              background: filterCat === c ? COLORS.teal : COLORS.card,
              color: filterCat === c ? "#fff" : COLORS.muted,
              fontWeight: 600, cursor: "pointer", fontSize: 12,
              whiteSpace: "nowrap", flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div style={{
        background: COLORS.card, borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        border: `1px solid ${COLORS.border}`,
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center" }}>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>No transactions in this category.</p>
          </div>
        ) : (
          filtered.map((tx, i) => (
            <TransactionItem
              key={tx.id} tx={tx} currency={currency}
              showKESHint borderBottom={i < filtered.length - 1}
            />
          ))
        )}
      </div>
    </div>
  )
}