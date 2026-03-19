import { useState } from "react";
import { COLORS, categoryColors } from "../utils/theme";
import { CURRENCIES } from "../utils/currency";

export default function AddTransactionModal({ currency, setCurrency, onAdd, onClose }) {
  const [form, setForm] = useState({ label: "", amount: "", type: "debit", category: "Food" });
  const cur = CURRENCIES[currency];

  function handleSubmit() {
    if (!form.label || !form.amount) return;
    onAdd(form);
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: COLORS.card, borderRadius: "24px 24px 0 0",
        padding: 24, width: "100%", maxWidth: 430,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>Add Transaction</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.muted }}>✕</button>
        </div>

        {/* Description */}
        <input
          placeholder="Description e.g. Naivas Shopping"
          value={form.label}
          onChange={e => setForm({ ...form, label: e.target.value })}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: "1.5px solid #E8EEF4", marginBottom: 12,
            fontSize: 14, boxSizing: "border-box", outline: "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />

        {/* Amount */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{
            position: "absolute", left: 16, top: "50%",
            transform: "translateY(-50%)", color: COLORS.muted,
            fontSize: 13, fontWeight: 600,
          }}>
            {cur.symbol}
          </span>
          <input
            placeholder="0.00"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            style={{
              width: "100%", padding: "12px 16px 12px 52px",
              borderRadius: 12, border: "1.5px solid #E8EEF4",
              fontSize: 14, boxSizing: "border-box", outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {["debit", "credit"].map(t => (
            <button
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              style={{
                flex: 1, padding: "10px", borderRadius: 12,
                border: `1.5px solid ${form.type === t ? COLORS.teal : "#E8EEF4"}`,
                background: form.type === t ? COLORS.tealLight : "#fff",
                color: form.type === t ? COLORS.teal : COLORS.muted,
                fontWeight: 600, cursor: "pointer", fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t === "debit" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: "1.5px solid #E8EEF4", marginBottom: 20,
            fontSize: 14, outline: "none", background: "#fff",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: 14, borderRadius: 14,
              border: "1.5px solid #E8EEF4", background: "#fff",
              color: COLORS.muted, cursor: "pointer", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 2, padding: 14, borderRadius: 14, border: "none",
              background: COLORS.teal, color: "#fff",
              cursor: "pointer", fontWeight: 700, fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
