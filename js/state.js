/**
 * State Management System
 * Handles: transactions, roles, settings, and persistence
 */

export const INITIAL_MOCK_DATA = [
  { id: '1', date: '2024-03-01', description: 'Monthly Salary', amount: 5000, category: 'Salary', type: 'income' },
  { id: '2', date: '2024-03-05', description: 'Rent Payment', amount: 1200, category: 'Housing', type: 'expense' },
  { id: '3', date: '2024-03-08', description: 'Grocery Shopping', amount: 150, category: 'Food', type: 'expense' },
  { id: '4', date: '2024-03-10', description: 'Freelance Project', amount: 800, category: 'Business', type: 'income' },
  { id: '5', date: '2024-03-12', description: 'Internet Bill', amount: 60, category: 'Bills', type: 'expense' },
  { id: '6', date: '2024-03-15', description: 'Dinner out', amount: 80, category: 'Food', type: 'expense' },
  { id: '7', date: '2024-03-18', description: 'Amazon Purchase', amount: 45, category: 'Shopping', type: 'expense' },
  { id: '8', date: '2024-03-20', description: 'Gym Membership', amount: 50, category: 'Health', type: 'expense' },
  { id: '9', date: '2024-03-22', description: 'Stock Dividend', amount: 120, category: 'Investment', type: 'income' },
  { id: '10', date: '2024-03-25', description: 'Netflix Subscription', amount: 15, category: 'Entertainment', type: 'expense' },
];

export class AppState {
  constructor() {
    this.storageKey = 'finance_dashboard_state';
    this.load();
  }

  load() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      this.transactions = data.transactions || INITIAL_MOCK_DATA;
      this.role = data.role || 'admin';
      this.theme = data.theme || 'dark';
    } else {
      this.transactions = INITIAL_MOCK_DATA;
      this.role = 'admin';
      this.theme = 'dark';
      this.save();
    }
  }

  save() {
    const data = {
      transactions: this.transactions,
      role: this.role,
      theme: this.theme
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Transaction Actions
  addTransaction(transaction) {
    this.transactions.unshift(transaction);
    this.save();
  }

  updateTransaction(id, updatedTransaction) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...updatedTransaction };
      this.save();
    }
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    this.save();
  }

  // Setters
  setRole(role) {
    this.role = role;
    this.save();
  }

  setTheme(theme) {
    this.theme = theme;
    this.save();
  }

  // Derived State (Insights/Summary)
  getSummary() {
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses
    };
  }

  getCategoryBreakdown() {
    const breakdown = {};
    this.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + Number(t.amount);
      });
    return breakdown;
  }

  getMonthlyComparison() {
    // Simplified for this mock: group by month from ISO dates
    const monthlyData = {};
    this.transactions.forEach(t => {
        const month = t.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        if (t.type === 'income') monthlyData[month].income += Number(t.amount);
        else monthlyData[month].expense += Number(t.amount);
    });
    return monthlyData;
  }
  
  getHighestSpendingCategory() {
      const breakdown = this.getCategoryBreakdown();
      let max = 0;
      let category = 'None';
      for (const [cat, val] of Object.entries(breakdown)) {
          if (val > max) {
              max = val;
              category = cat;
          }
      }
      return { category, amount: max };
  }
}

export const state = new AppState();
