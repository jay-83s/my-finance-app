import { useState } from "react"
import { useTheme } from "../context/ThemeContext"
import { formatAmount } from "../utils/currency"
import CurrencySwitcher from "../components/CurrencySwitcher"
import TransactionItem from "../components/TransactionItem"

const glass = (isDark) => ({
  background: isDark ? 'rgba(5,15,30,0.55)' : 'rgba(8,20,45,0.45)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
})

export default function History({ finance, isDesktop }) {
  const { transactions, currency, setCurrency } = finance
  const { isDark } = useTheme()
  const [filterCat, setFilterCat] = useState("All")

  const textColor  = '#F0F7FF'
  const mutedColor = 'rgba(180,220,240,0.5)'

  const categories = ["All", ...Array.from(new Set(transactions.map(t => t.category)))]
  const filtered   = filterCat === "All" ? transactions : transactions.filter(t => t.category === filterCat)

  return (
    <div style={{ padding: isDesktop ? "32px 40px 60px" : "24px 20px 100px" }}>

      {/* ── HEADER BANNER — modern card payment transaction ── */}
      <div style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        marginBottom: 20, minHeight: 140,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '24px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(135deg, rgba(4,12,24,0.85) 0%, rgba(4,12,24,0.65) 100%)'
            : 'linear-gradient(135deg, rgba(4,12,24,0.75) 0%, rgba(4,12,24,0.5) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(180,220,240,0.55)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              All entries
            </p>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textColor, fontFamily: "'Sora', sans-serif" }}>
              Transactions
            </h2>
          </div>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
        </div>
      </div>

      {/* ── FILTER PILLS ── */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto",
        marginBottom: 16, paddingBottom: 4,
      }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            style={{
              padding: "8px 16px", borderRadius: 20, cursor: "pointer",
              border: `1.5px solid ${filterCat === c ? '#0BBFBF' : 'rgba(255,255,255,0.12)'}`,
              background: filterCat === c
                ? 'linear-gradient(135deg, rgba(11,191,191,0.28) 0%, rgba(8,148,148,0.18) 100%)'
                : 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              color: filterCat === c ? '#0BBFBF' : mutedColor,
              fontWeight: 600, fontSize: 12,
              whiteSpace: "nowrap", flexShrink: 0,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
              boxShadow: filterCat === c ? '0 2px 12px rgba(11,191,191,0.2)' : 'none',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div style={{ ...glass(isDark), borderRadius: 20, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: mutedColor, fontSize: 14 }}>
              No transactions in this category.
            </p>
          </div>
        ) : (
          filtered.map((tx, i) => (
            <TransactionItem
              key={tx.id} tx={tx} currency={currency}
              showKESHint
              borderBottom={i < filtered.length - 1}
            />
          ))
        )}
      </div>

    </div>
  )
}