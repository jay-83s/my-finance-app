import { useState, useEffect } from 'react'
import { getTransactions, addTransaction, deleteTransaction } from '../api/index'

export function useFinance(savingsGoal = 20) {
  const [transactions, setTransactions] = useState([])
  const [currency, setCurrency]         = useState('KES')
  const [screen, setScreen]             = useState('dashboard')
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setTransactions([]) // clear old data immediately on fetch
    setLoading(true)
    try {
      const res = await getTransactions()
      setTransactions(res.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentMonth = new Date().toISOString().slice(0, 7)

  // This month
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const monthlySavings = transactions
    .filter(t => t.type === 'savings' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const monthlyWithdrawals = transactions
    .filter(t => t.type === 'savings_withdrawal' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  // Pay yourself first math
  const spendingBudget        = Math.max(0, monthlyIncome - monthlySavings + monthlyWithdrawals)
  const availableToSpend      = Math.max(0, spendingBudget - monthlyExpenses)
  const requiredSavings       = (savingsGoal / 100) * monthlyIncome
  const remainingToSave       = Math.max(0, requiredSavings - monthlySavings)
  const canSpend              = monthlyIncome === 0 || monthlySavings >= requiredSavings
  const totalSavingsAvailable = Math.max(0, monthlySavings - monthlyWithdrawals)

  // Fund status
  const lowFundsThreshold = spendingBudget * 0.05
  const isLowFunds        = spendingBudget > 0 && availableToSpend > 0 && availableToSpend <= lowFundsThreshold
  const isNoFunds         = spendingBudget > 0 && availableToSpend <= 0

  // All time balance = income - savings - expenses (withdrawals don't affect balance)
  const balance = transactions.reduce((acc, t) => {
    if (t.type === 'income')             return acc + parseFloat(t.amount)
    if (t.type === 'expense')            return acc - parseFloat(t.amount)
    if (t.type === 'savings')            return acc - parseFloat(t.amount)
    if (t.type === 'savings_withdrawal') return acc
    return acc
  }, 0)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const totalSavings = transactions
    .filter(t => t.type === 'savings')
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(parseFloat(t.amount))
      return acc
    }, {})

  const handleAddTransaction = async ({ label, amount, type, category }) => {
    try {
      const date = new Date().toISOString().split('T')[0]
      const res = await addTransaction({
        label,
        amount: parseFloat(amount),
        type,
        category,
        date,
        icon: type === 'savings'            ? '💰'
            : type === 'income'             ? '📥'
            : type === 'savings_withdrawal' ? '🔄'
            : '💸'
      })
      await fetchTransactions()
      return res.data
    } catch (error) {
      throw error
    }
  }

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id)
      await fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  return {
    transactions, currency, setCurrency,
    screen, setScreen, loading,
    balance, totalIncome, totalExpenses, totalSavings, categoryTotals,
    monthlyIncome, monthlySavings, monthlyExpenses, monthlyWithdrawals,
    requiredSavings, remainingToSave, canSpend,
    spendingBudget, availableToSpend, isLowFunds, isNoFunds,
    totalSavingsAvailable,
    addTransaction: handleAddTransaction,
    deleteTransaction: handleDeleteTransaction,
  }
}