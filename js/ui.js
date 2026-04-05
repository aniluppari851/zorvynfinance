/**
 * UI Controller
 * Handles DOM manipulation, event listeners, and role-based UI.
 */
import { formatCurrency, formatDate, generateId } from './utils.js';

export class UIController {
  constructor(stateRef, chartsRef) {
    this.state = stateRef;
    this.charts = chartsRef;
    this.currentFilters = {
      search: '',
      type: 'all',
      sort: 'date-desc'
    };
    
    this.initElements();
    this.attachEventListeners();
  }

  initElements() {
    this.elements = {
      balance: document.getElementById('balance-value'),
      income: document.getElementById('income-value'),
      expenses: document.getElementById('expense-value'),
      tableBody: document.getElementById('transactions-body'),
      emptyState: document.getElementById('empty-state'),
      roleSelect: document.getElementById('role-select'),
      globalSearch: document.getElementById('global-search'),
      typeFilter: document.getElementById('type-filter'),
      sortFilter: document.getElementById('sort-filter'),
      addBtn: document.getElementById('add-transaction-btn'),
      modal: document.getElementById('transaction-modal'),
      form: document.getElementById('transaction-form'),
      closeModal: document.getElementById('close-modal'),
      themeToggle: document.getElementById('theme-toggle'),
      themeIcon: document.getElementById('theme-icon'),
      topCategory: document.getElementById('top-category'),
      budgetStatus: document.getElementById('budget-status'),
      navItems: document.querySelectorAll('.nav-item')
    };
  }

  attachEventListeners() {
    // Role Switch
    this.elements.roleSelect.addEventListener('change', (e) => {
      this.state.setRole(e.target.value);
      this.applyRoleUI();
    });

    // Filters
    this.elements.globalSearch.addEventListener('input', (e) => {
      this.currentFilters.search = e.target.value.toLowerCase();
      this.updateTransactions();
    });

    this.elements.typeFilter.addEventListener('change', (e) => {
      this.currentFilters.type = e.target.value;
      this.updateTransactions();
    });

    this.elements.sortFilter.addEventListener('change', (e) => {
      this.currentFilters.sort = e.target.value;
      this.updateTransactions();
    });

    // Theme
    this.elements.themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
      this.state.setTheme(newTheme);
      this.charts.update();
    });

    // Modal
    this.elements.addBtn.addEventListener('click', () => this.openModal());
    this.elements.closeModal.addEventListener('click', () => this.closeModal());
    this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
    // Table delegation for actions
    this.elements.tableBody.addEventListener('click', (e) => {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        
        const id = target.dataset.id;
        const action = target.dataset.action;
        
        if (action === 'edit') this.openModal(id);
        if (action === 'delete') this.handleDelete(id);
    });

    // Navigation
    this.elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.querySelector('span').textContent.toLowerCase();
            this.handleNavigation(text, item);
        });
    });
  }

  handleNavigation(page, activeItem) {
      // Update Active class
      this.elements.navItems.forEach(i => i.classList.remove('active'));
      activeItem.classList.add('active');

      // Scroll to section
      if (page === 'dashboard') {
          document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (page === 'transactions') {
          document.getElementById('transactions-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      // Add more cases if needed for Investments/Settings
  }

  render() {
    this.updateSummary();
    this.updateTransactions();
    this.updateInsights();
    this.applyRoleUI();
    this.setTheme(this.state.theme);
    
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateSummary() {
    const { balance, income, expenses } = this.state.getSummary();
    this.elements.balance.textContent = formatCurrency(balance);
    this.elements.income.textContent = formatCurrency(income);
    this.elements.expenses.textContent = formatCurrency(expenses);
    
    // Animate entries
    [this.elements.balance, this.elements.income, this.elements.expenses].forEach(el => {
        el.classList.add('animate-pulse');
        setTimeout(() => el.classList.remove('animate-pulse'), 1000);
    });
  }

  updateTransactions() {
    let filtered = this.state.transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(this.currentFilters.search) || 
                            t.category.toLowerCase().includes(this.currentFilters.search);
      const matchesType = this.currentFilters.type === 'all' || t.type === this.currentFilters.type;
      return matchesSearch && matchesType;
    });

    // Sort
    filtered.sort((a, b) => {
      if (this.currentFilters.sort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (this.currentFilters.sort === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (this.currentFilters.sort === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (this.currentFilters.sort === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });

    if (filtered.length === 0) {
      this.elements.tableBody.innerHTML = '';
      this.elements.emptyState.style.display = 'block';
    } else {
      this.elements.emptyState.style.display = 'none';
      this.elements.tableBody.innerHTML = filtered.map(t => `
        <tr>
          <td style="color: var(--text-secondary); font-size: 0.875rem;">${formatDate(t.date)}</td>
          <td style="font-weight: 500;">${t.description}</td>
          <td><span class="badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}">${t.category}</span></td>
          <td class="amount ${t.type === 'income' ? 'income' : 'expense'}">
            ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
          </td>
          <td class="admin-only">
            <div style="display: flex; gap: 0.5rem;">
               <button class="btn-icon action-btn" data-id="${t.id}" data-action="edit" title="Edit">
                  <i data-lucide="edit-2" style="width: 16px;"></i>
               </button>
               <button class="btn-icon action-btn" data-id="${t.id}" data-action="delete" title="Delete" style="color: var(--danger);">
                  <i data-lucide="trash-2" style="width: 16px;"></i>
               </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
    
    this.applyRoleUI();
    if (window.lucide) window.lucide.createIcons();
  }

  updateInsights() {
      const top = this.state.getHighestSpendingCategory();
      this.elements.topCategory.textContent = top.category;
      
      const { income, expenses } = this.state.getSummary();
      const ratio = expenses / income;
      
      if (ratio > 0.8) {
          this.elements.budgetStatus.textContent = 'High Spending';
          this.elements.budgetStatus.style.color = 'var(--danger)';
      } else if (ratio > 0.5) {
          this.elements.budgetStatus.textContent = 'Moderate';
          this.elements.budgetStatus.style.color = 'var(--warning)';
      } else {
          this.elements.budgetStatus.textContent = 'Healthy';
          this.elements.budgetStatus.style.color = 'var(--success)';
      }
  }

  applyRoleUI() {
    const isAdmin = this.state.role === 'admin';
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
      el.style.display = isAdmin ? '' : 'none';
    });
    this.elements.roleSelect.value = this.state.role;
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.elements.themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) window.lucide.createIcons();
  }

  // Modal Methods
  openModal(id = null) {
    const title = document.getElementById('modal-title');
    const editId = document.getElementById('edit-id');
    const form = this.elements.form;
    
    if (id) {
       const t = this.state.transactions.find(x => x.id === id);
       title.textContent = 'Edit Transaction';
       editId.value = t.id;
       form.elements['desc-input'].value = t.description;
       form.elements['date-input'].value = t.date;
       form.elements['amount-input'].value = t.amount;
       form.elements['category-input'].value = t.category;
       form.elements['type-input'].value = t.type;
    } else {
       title.textContent = 'New Transaction';
       editId.value = '';
       form.reset();
       form.elements['date-input'].value = new Date().toISOString().split('T')[0];
    }
    
    this.elements.modal.style.display = 'flex';
  }

  closeModal() {
    this.elements.modal.style.display = 'none';
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const data = {
        description: e.target.elements['desc-input'].value,
        date: e.target.elements['date-input'].value,
        amount: Number(e.target.elements['amount-input'].value),
        category: e.target.elements['category-input'].value,
        type: e.target.elements['type-input'].value
    };
    
    const id = e.target.elements['edit-id'].value;
    if (id) {
        this.state.updateTransaction(id, data);
    } else {
        this.state.addTransaction({ id: generateId(), ...data });
    }
    
    this.closeModal();
    this.render();
    this.charts.update();
  }

  handleDelete(id) {
      if (confirm('Are you sure you want to delete this transaction?')) {
          this.state.deleteTransaction(id);
          this.render();
          this.charts.update();
      }
  }
}
