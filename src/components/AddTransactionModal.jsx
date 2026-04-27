import { useState, useRef } from "react"
import { TrendingUp, PiggyBank, TrendingDown, ArrowLeftRight, X, ChevronRight, ChevronLeft } from "lucide-react"
import { COLORS } from "../utils/theme"
import { CURRENCIES } from "../utils/currency"

const TRANSACTION_TYPES = [
  {
    value: "income",
    label: "Income",
    description: "Money you received — savings auto deducted",
    color: COLORS.green,
    bg: "#F0FDF4",
    Icon: TrendingUp,
  },
  {
    value: "savings",
    label: "Extra Savings",
    description: "Save more on top of your auto savings",
    color: "#6366F1",
    bg: "#EEF2FF",
    Icon: PiggyBank,
  },
  {
    value: "expense",
    label: "Expense",
    description: "Money you spent from your budget",
    color: COLORS.red,
    bg: "#FFF5F5",
    Icon: TrendingDown,
  },
  {
    value: "savings_withdrawal",
    label: "Use Savings",
    description: "Move savings to spending balance",
    color: "#F59E0B",
    bg: "#FFFBEB",
    Icon: ArrowLeftRight,
  },
]

const EXPENSE_CATEGORIES = ["Food", "Housing", "Transport", "Utilities", "Shopping", "Healthcare", "Education", "Entertainment", "Other"]
const SAVINGS_CATEGORIES = ["Emergency Fund", "Investment", "Goals", "Retirement", "Other"]
const INCOME_CATEGORIES  = ["Salary", "Freelance", "Business", "Gift", "Other"]

export default function AddTransactionModal({ currency, onAdd, onClose, finance }) {
  const [step, setStep]           = useState(1)
  const [form, setForm]           = useState({ label: "", amount: "", type: "", category: "" })
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  // ── Double-submission guard ──
  // On mobile, touch + synthetic click can both fire handleSubmit.
  // This ref blocks any second call until the first one fully resolves.
  const isSubmitting = useRef(false)

  const cur = CURRENCIES[currency]

  const getCategories = () => {
    if (form.type === "expense") return EXPENSE_CATEGORIES
    if (form.type === "savings") return SAVINGS_CATEGORIES
    if (form.type === "income")  return INCOME_CATEGORIES
    return ["Other"]
  }

  const selectedType = TRANSACTION_TYPES.find(t => t.value === form.type)

  const handleSubmit = async () => {
    // Block if already in flight
    if (isSubmitting.current) return
    if (!form.label || !form.amount) return
    if (form.type !== "savings_withdrawal" && !form.category) return

    isSubmitting.current = true
    setError("")
    setLoading(true)

    try {
      const result = await onAdd({
        ...form,
        category: form.category || "Savings Withdrawal",
      })
      if (result?.autoSaved) {
        setSuccessMsg(`✅ Income added! KES ${result.autoSaved.toLocaleString()} auto saved.`)
        setTimeout(() => onClose(), 2500)
      } else {
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      // Only release the guard on error so user can retry
      isSubmitting.current = false
    }

    setLoading(false)
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div style={{
        background: COLORS.card, borderRadius: "24px 24px 0 0",
        padding: 24, width: "100%", maxWidth: 430,
        maxHeight: "90vh", overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
              Add Entry
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.muted }}>
              Step {step} of 2
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#F0F4F8", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}
          >
            <X size={18} color={COLORS.muted} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 4, background: "#F0F4F8", borderRadius: 4, marginBottom: 24 }}>
          <div style={{
            height: "100%", borderRadius: 4, background: COLORS.teal,
            width: step === 1 ? "50%" : "100%", transition: "width 0.3s",
          }} />
        </div>

        {/* Success message */}
        {successMsg && (
          <div style={{ background: "#F0FDF4", border: "1.5px solid #22C55E", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ margin: 0, color: COLORS.green, fontWeight: 700, fontSize: 13 }}>{successMsg}</p>
          </div>
        )}

        {/* Step 1 — Choose Type */}
        {step === 1 && (
          <div>
            <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              What are you recording today?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TRANSACTION_TYPES.map(type => {
                const Icon = type.Icon
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      setForm({ ...form, type: type.value, category: "" })
                      setStep(2)
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px", borderRadius: 16, cursor: "pointer",
                      border: `2px solid ${form.type === type.value ? type.color : "#E8EEF4"}`,
                      background: form.type === type.value ? type.bg : "#fff",
                      textAlign: "left", transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: type.bg, display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon size={24} color={type.color} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: COLORS.text, fontSize: 15 }}>
                        {type.label}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.muted }}>
                        {type.description}
                      </p>
                    </div>
                    <ChevronRight size={18} color={COLORS.muted} />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2 — Fill Details */}
        {step === 2 && selectedType && (
          <div>
            {/* Selected type badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: selectedType.bg, borderRadius: 20,
              padding: "6px 14px", marginBottom: 20,
            }}>
              <selectedType.Icon size={14} color={selectedType.color} strokeWidth={2.5} />
              <span style={{ fontWeight: 700, color: selectedType.color, fontSize: 13 }}>
                {selectedType.label}
              </span>
            </div>

            {/* Auto savings info for income */}
            {form.type === "income" && finance && (
              <div style={{
                background: "#EEF2FF", borderRadius: 12, padding: "10px 14px",
                marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
              }}>
                <PiggyBank size={16} color="#6366F1" />
                <p style={{ margin: 0, fontSize: 12, color: "#4F46E5", fontWeight: 600 }}>
                  {finance.savingsGoalPct || 20}% will be automatically saved when you add income
                </p>
              </div>
            )}

            {/* Savings available for withdrawal */}
            {form.type === "savings_withdrawal" && finance && (
              <div style={{
                background: "#FFFBEB", borderRadius: 12, padding: "10px 14px",
                marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>💰</span>
                <p style={{ margin: 0, fontSize: 12, color: "#92400E", fontWeight: 600 }}>
                  Available in savings: KES {finance.totalSavingsAvailable?.toLocaleString() || 0}
                </p>
              </div>
            )}

            {/* Description */}
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: COLORS.text }}>
              Description
            </p>
            <input
              placeholder={
                form.type === "savings"            ? "e.g. Extra emergency fund"      :
                form.type === "expense"            ? "e.g. Naivas Shopping"           :
                form.type === "savings_withdrawal" ? "e.g. Moving savings for rent"   :
                                                     "e.g. Monthly Salary"
              }
              value={form.label}
              onChange={e => setForm({ ...form, label: e.target.value })}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid #E8EEF4", marginBottom: 16,
                fontSize: 14, boxSizing: "border-box", outline: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />

            {/* Amount */}
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: COLORS.text }}>
              Amount ({currency})
            </p>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{
                position: "absolute", left: 16, top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.muted, fontSize: 13, fontWeight: 600,
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

            {/* Category */}
            {form.type !== "savings_withdrawal" && (
              <>
                <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: COLORS.text }}>
                  Category
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {getCategories().map(cat => (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      style={{
                        padding: "8px 14px", borderRadius: 20,
                        border: `1.5px solid ${form.category === cat ? COLORS.teal : "#E8EEF4"}`,
                        background: form.category === cat ? COLORS.tealLight : "#fff",
                        color: form.category === cat ? COLORS.teal : COLORS.muted,
                        fontWeight: 600, cursor: "pointer", fontSize: 12,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: "#FFF5F5", border: "1.5px solid #FCA5A5",
                borderRadius: 12, padding: "12px 16px", marginBottom: 16,
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>🚫</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: COLORS.red, fontSize: 13 }}>
                    Cannot process
                  </p>
                  <p style={{ margin: "2px 0 0", color: COLORS.red, fontSize: 12 }}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setStep(1); setError(""); isSubmitting.current = false }}
                style={{
                  flex: 1, padding: 14, borderRadius: 14,
                  border: "1.5px solid #E8EEF4", background: "#fff",
                  color: COLORS.muted, cursor: "pointer", fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                // Use onPointerUp instead of onClick to fire once on both touch and mouse
                onPointerUp={handleSubmit}
                disabled={loading || !form.label || !form.amount || (form.type !== "savings_withdrawal" && !form.category)}
                style={{
                  flex: 2, padding: 14, borderRadius: 14, border: "none",
                  background: loading || !form.label || !form.amount
                    ? "#E8EEF4"
                    : COLORS.teal,
                  color: loading || !form.label || !form.amount
                    ? COLORS.muted
                    : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading ? "Processing..." : "Save Entry"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}