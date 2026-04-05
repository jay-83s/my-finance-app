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