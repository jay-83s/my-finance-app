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
    try {
      const res = await getTransactions()
      setTransactions(res.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Current month
  const currentMonth = new Date().toISOString().slice(0, 7)

  // All time totals
  const balance = transactions.reduce((acc, t) => {
    if (t.type === 'income')  return acc + parseFloat(t.amount)
    if (t.type === 'expense') return acc - parseFloat(t.amount)
    if (t.type === 'savings') return acc - parseFloat(t.amount)
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

  // This month's data
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const monthlySavings = transactions
    .filter(t => t.type === 'savings' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date?.slice(0, 7) === currentMonth)
    .reduce((a, t) => a + parseFloat(t.amount), 0)

  // Pay yourself first calculations
  const requiredSavings  = (savingsGoal / 100) * monthlyIncome
  const remainingToSave  = Math.max(0, requiredSavings - monthlySavings)
  const canSpend         = monthlyIncome === 0 || monthlySavings >= requiredSavings
  const availableToSpend = Math.max(0, monthlyIncome - requiredSavings - monthlyExpenses)

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(parseFloat(t.amount))
      return acc
    }, {})

  const handleAddTransaction = async ({ label, amount, type, category }) => {
    try {
      const date = new Date().toISOString().split('T')[0]
      await addTransaction({
        label,
        amount: parseFloat(amount),
        type,
        category,
        date,
        icon: type === 'savings' ? '💰' : type === 'income' ? '📥' : '💸'
      })
      fetchTransactions()
    } catch (error) {
      // Return the error so components can handle it
      throw error
    }
  }

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id)
      fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  return {
    transactions, currency, setCurrency,
    screen, setScreen, loading,
    balance, totalIncome, totalExpenses, totalSavings, categoryTotals,
    monthlyIncome, monthlySavings, monthlyExpenses,
    requiredSavings, remainingToSave, canSpend, availableToSpend,
    addTransaction: handleAddTransaction,
    deleteTransaction: handleDeleteTransaction,
  }
}