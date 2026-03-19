import { useState } from "react";
import { COLORS } from "../utils/theme";
import { CURRENCIES, KES_TO_USD, formatAmount } from "../utils/currency";
import { contacts } from "../data/seedData";
import CurrencySwitcher from "../components/CurrencySwitcher";

export default function Transfer({ finance }) {
  const { currency, setCurrency, balance, sendMoney } = finance;

  const [amount, setAmount]             = useState("");
  const [selectedContact, setSelected] = useState(null);
  const [success, setSuccess]           = useState(false);

  const cur          = CURRENCIES[currency];
  const quickAmounts = currency === "KES" ? [500, 1000, 2000, 5000] : [5, 10, 20, 50];
  const ready        = selectedContact && amount;

  function handleSend() {
    if (!ready) return;
    sendMoney({ contact: selectedContact, amount: parseFloat(amount) });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setAmount(""); setSelected(null); }, 2500);
  }

  return (
    <div style={{ padding: "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
          Send Money
        </h2>
        <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
      </div>

      <p style={{ color: COLORS.muted, fontSize: 13, margin: "0 0 24px" }}>
        Balance: <strong style={{ color: COLORS.text }}>{formatAmount(balance, currency)}</strong>
        {currency === "USD" && (
          <span style={{ color: COLORS.muted, fontSize: 11 }}> (KES {Math.round(balance).toLocaleString()})</span>
        )}
      </p>

      {/* Success Banner */}
      {success && (
        <div style={{
          background: "#F0FDF4", border: "1.5px solid #22C55E",
          borderRadius: 16, padding: "14px 18px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: COLORS.green, fontSize: 14 }}>Transfer Successful!</p>
            <p style={{ margin: 0, color: COLORS.muted, fontSize: 12 }}>Sent to {selectedContact?.name}</p>
          </div>
        </div>
      )}

      {/* Contacts */}
      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: COLORS.text }}>Recent Contacts</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {contacts.map(c => (
          <button
            key={c.name}
            onClick={() => setSelected(c)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: selectedContact?.name === c.name ? COLORS.tealLight : COLORS.card,
              border: `1.5px solid ${selectedContact?.name === c.name ? COLORS.teal : "#E8EEF4"}`,
              borderRadius: 16, padding: "12px 14px", cursor: "pointer",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: c.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 14,
            }}>
              {c.initials}
            </div>
            <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 500, whiteSpace: "nowrap" }}>
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: COLORS.text }}>Amount ({currency})</p>
      <div style={{
        background: COLORS.card, borderRadius: 20,
        border: `2px solid ${amount ? COLORS.teal : "#E8EEF4"}`,
        padding: "0 20px", marginBottom: 8, transition: "border-color 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: COLORS.muted, fontSize: 18, marginRight: 10, fontWeight: 600 }}>
            {cur.symbol}
          </span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            style={{
              border: "none", background: "transparent",
              fontSize: 28, fontWeight: 800, color: COLORS.text,
              width: "100%", padding: "20px 0", outline: "none",
              fontFamily: "'Sora', sans-serif",
            }}
          />
        </div>
      </div>

      {/* KES hint when in USD */}
      {currency === "USD" && amount && (
        <p style={{ margin: "0 0 16px", fontSize: 12, color: COLORS.muted, textAlign: "center" }}>
          ≈ KES {Math.round(parseFloat(amount) / KES_TO_USD).toLocaleString()}
        </p>
      )}
      {currency !== "USD" && <div style={{ marginBottom: 16 }} />}

      {/* Quick Amount Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        {quickAmounts.map(a => (
          <button
            key={a}
            onClick={() => setAmount(String(a))}
            style={{
              padding: "10px 0", borderRadius: 12,
              border: `1.5px solid ${amount === String(a) ? COLORS.teal : "#E8EEF4"}`,
              background: amount === String(a) ? COLORS.tealLight : COLORS.card,
              color: amount === String(a) ? COLORS.teal : COLORS.muted,
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            +{currency === "USD" ? `$${a}` : a.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!ready}
        style={{
          width: "100%", padding: "18px", borderRadius: 18, border: "none",
          background: ready ? COLORS.teal : "#E8EEF4",
          color: ready ? "#fff" : COLORS.muted,
          fontSize: 16, fontWeight: 800,
          cursor: ready ? "pointer" : "not-allowed",
          transition: "all 0.3s",
          boxShadow: ready ? `0 8px 24px ${COLORS.teal}66` : "none",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Send Money{amount ? ` · ${cur.symbol}${parseFloat(amount).toLocaleString()}` : ""}
      </button>

    </div>
  );
}
