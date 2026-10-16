/**
 * Montra Intelligent Mock Data Store
 * Provides offline & demo fallbacks for all API routes so the frontend
 * always renders rich, interactive financial data even when the Spring Boot
 * backend or PostgreSQL database is offline.
 */

const STORAGE_KEY = 'montra_mock_db_v2';

function getInitialData() {
  return {
    dashboard: {
      totalIncome: 42500.0,
      totalExpenses: 16800.0,
      availableBalance: 25700.0,
      monthlyIncome: 20000.0,
      monthlyExpenses: 9400.0,
      topExpenseCategories: {
        'Food & Dining': 3800.0,
        Education: 2800.0,
        Housing: 1600.0,
        Entertainment: 800.0,
        Transport: 400.0,
      },
    },
    businessDashboard: {
      todaysSales: 14500.0,
      todaysExpenses: 3800.0,
      todaysProfit: 10700.0,
      monthlySales: 385000.0,
      monthlyExpenses: 142000.0,
      monthlyProfit: 243000.0,
      pendingSalaries: 35000.0,
      activeStaffCount: 6,
      overdueLoansCount: 0,
    },
    income: [
      {
        id: 1,
        source: 'FREELANCING',
        amount: 15000,
        incomeDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        paymentMethod: 'BANK_TRANSFER',
        notes: 'Fintech dashboard UI milestone',
      },
      {
        id: 2,
        source: 'SCHOLARSHIP',
        amount: 18000,
        incomeDate: new Date(Date.now() - 20 * 86400000).toISOString(),
        paymentMethod: 'DIRECT_DEPOSIT',
        notes: 'Monthly research allowance',
      },
      {
        id: 3,
        source: 'PART_TIME_JOB',
        amount: 9500,
        incomeDate: new Date(Date.now() - 26 * 86400000).toISOString(),
        paymentMethod: 'UPI',
        notes: 'Python & Algorithms tutoring',
      },
    ],
    expenses: [
      {
        id: 1,
        category: 'FOOD',
        amount: 3800,
        expenseDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        paymentMethod: 'CARD',
        notes: 'Whole Foods groceries & snacks',
      },
      {
        id: 2,
        category: 'EDUCATION',
        amount: 2450,
        expenseDate: new Date(Date.now() - 7 * 86400000).toISOString(),
        paymentMethod: 'DEBIT_CARD',
        notes: 'Advanced Algorithms certification',
      },
      {
        id: 3,
        category: 'INTERNET',
        amount: 999,
        expenseDate: new Date(Date.now() - 14 * 86400000).toISOString(),
        paymentMethod: 'AUTO_DEBIT',
        notes: 'High-speed fiber broadband',
      },
      {
        id: 4,
        category: 'ENTERTAINMENT',
        amount: 650,
        expenseDate: new Date(Date.now() - 18 * 86400000).toISOString(),
        paymentMethod: 'UPI',
        notes: 'Coffee & weekend study session',
      },
    ],
    budgets: [
      {
        id: 1,
        name: 'Food & Dining',
        category: 'FOOD',
        amount: 6000,
        currentSpent: 3800,
        period: 'MONTHLY',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'NORMAL',
      },
      {
        id: 2,
        name: 'Education & Courses',
        category: 'EDUCATION',
        amount: 4000,
        currentSpent: 2450,
        period: 'MONTHLY',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'NORMAL',
      },
      {
        id: 3,
        name: 'Utilities & Bills',
        category: 'INTERNET',
        amount: 2500,
        currentSpent: 1600,
        period: 'MONTHLY',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'NORMAL',
      },
      {
        id: 4,
        name: 'Entertainment',
        category: 'ENTERTAINMENT',
        amount: 1500,
        currentSpent: 650,
        period: 'MONTHLY',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'NORMAL',
      },
    ],
    loans: [
      {
        id: 1,
        personName: 'Rahul Verma',
        personPhone: '+91 9876543210',
        originalAmount: 5000,
        remainingAmount: 2500,
        startDate: '2026-08-01',
        dueDate: '2026-10-25',
        status: 'PARTIALLY_PAID',
        type: 'LENT',
        description: 'Semester textbooks share',
        payments: [
          {
            id: 101,
            loanId: 1,
            amount: 2500,
            paymentDate: '2026-09-15',
            paymentMethod: 'UPI',
            description: 'Half payment transferred via GPay',
          },
        ],
      },
      {
        id: 2,
        personName: 'Priya Sharma',
        personPhone: '+91 9812345678',
        originalAmount: 3000,
        remainingAmount: 1000,
        startDate: '2026-09-01',
        dueDate: '2026-11-15',
        status: 'PARTIALLY_PAID',
        type: 'LENT',
        description: 'Hackathon ticket sponsorship',
        payments: [
          {
            id: 102,
            loanId: 2,
            amount: 2000,
            paymentDate: '2026-09-20',
            paymentMethod: 'NET_BANKING',
            description: 'Round 1 reimbursement',
          },
        ],
      },
      {
        id: 3,
        personName: 'Campus Tech Store',
        personPhone: '+91 9900112233',
        originalAmount: 2000,
        remainingAmount: 800,
        startDate: '2026-08-15',
        dueDate: '2026-10-01',
        status: 'OVERDUE',
        type: 'BORROWED',
        description: 'Hardware component installment',
        payments: [
          {
            id: 103,
            loanId: 3,
            amount: 1200,
            paymentDate: '2026-09-05',
            paymentMethod: 'DEBIT_CARD',
            description: 'Downpayment',
          },
        ],
      },
    ],
    recurring: [
      {
        id: 1,
        title: 'Cloud & AI Workspace',
        amount: 799,
        frequency: 'MONTHLY',
        nextDueDate: '2026-10-05',
        category: 'INTERNET',
        type: 'EXPENSE',
      },
      {
        id: 2,
        title: 'Health & Fitness Club',
        amount: 1200,
        frequency: 'MONTHLY',
        nextDueDate: '2026-10-01',
        category: 'HEALTHCARE',
        type: 'EXPENSE',
      },
      {
        id: 3,
        title: 'Monthly Stipend Deposit',
        amount: 18000,
        frequency: 'MONTHLY',
        nextDueDate: '2026-10-01',
        category: 'SCHOLARSHIP',
        type: 'INCOME',
      },
    ],
    calendar: [
      {
        id: 1,
        title: 'Allowance Deposit',
        type: 'INCOME',
        amount: 18000,
        date: '2026-09-01',
      },
      {
        id: 2,
        title: 'Internet Bill Due',
        type: 'EXPENSE',
        amount: 999,
        date: '2026-09-10',
      },
      {
        id: 3,
        title: 'Freelance Payout',
        type: 'INCOME',
        amount: 15000,
        date: '2026-09-20',
      },
      {
        id: 4,
        title: 'Rahul Loan Due',
        type: 'LOAN',
        amount: 2500,
        date: '2026-10-15',
      },
    ],
    notifications: [
      {
        id: 1,
        title: 'Autonomous Vault Deposit',
        message: '$342.18 scheduled for autonomous high-yield deposit this Friday.',
        read: false,
        createdAt: '2026-09-22T08:30:00Z',
        type: 'VAULT',
      },
      {
        id: 2,
        title: 'Emergency Goal: 88% Achieved',
        message: 'Your Emergency Reserve reached $22,000 of your $25,000 target!',
        read: false,
        createdAt: '2026-09-21T10:15:00Z',
        type: 'GOAL',
      },
      {
        id: 3,
        title: 'Welcome to Montra',
        message: 'Your smart wealth intelligence engine is running smoothly.',
        read: true,
        createdAt: '2026-09-20T09:00:00Z',
        type: 'SYSTEM',
      },
    ],
  };
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let parsed;
    if (!raw) {
      parsed = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } else {
      parsed = JSON.parse(raw);
    }
    // Self-heal and normalize loans if loaded from older structure
    if (parsed && Array.isArray(parsed.loans)) {
      parsed.loans = parsed.loans.map((l) => ({
        id: l.id,
        personName: l.personName || l.borrowerName || l.lenderName || 'Contact',
        personPhone: l.personPhone || '',
        type: l.type || 'LENT',
        originalAmount: parseFloat(l.originalAmount ?? l.amount ?? 0),
        remainingAmount: parseFloat(l.remainingAmount ?? l.amount ?? l.originalAmount ?? 0),
        startDate: l.startDate || '2026-08-01',
        dueDate: l.dueDate || null,
        status: l.status || 'ACTIVE',
        description: l.description || l.notes || '',
        payments: Array.isArray(l.payments) ? l.payments : [],
        history: Array.isArray(l.history) ? l.history : [],
        createdAt: l.createdAt || new Date().toISOString(),
        updatedAt: l.updatedAt || new Date().toISOString(),
      }));
    }
    return parsed;
  } catch {
    return getInitialData();
  }
}

function saveDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save to mock DB', err);
  }
}

/**
 * Handle offline / demo mock API endpoints
 */
export function handleMockRequest(url, method = 'get', data = null, params = null) {
  const cleanUrl = (url || '').replace(/^\/api/, '').split('?')[0].replace(/\/+$/, '');
  const verb = (method || 'get').toLowerCase();
  const db = loadDB();

  // Re-calculate dashboard aggregates based on actual current items
  const totalInc = db.income.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalExp = db.expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  db.dashboard.totalIncome = totalInc;
  db.dashboard.totalExpenses = totalExp;
  db.dashboard.availableBalance = Math.max(0, totalInc - totalExp);

  // 1. Dashboard
  if (cleanUrl === '/dashboard') {
    return db.dashboard;
  }

  if (cleanUrl === '/business/dashboard') {
    return db.businessDashboard;
  }

  // 2. Loans
  if (cleanUrl === '/loans/lent') {
    return db.loans.filter((l) => l.type === 'LENT');
  }
  if (cleanUrl === '/loans/borrowed') {
    return db.loans.filter((l) => l.type === 'BORROWED');
  }
  if (cleanUrl === '/loans/overdue') {
    const todayStr = new Date().toISOString().split('T')[0];
    return db.loans.filter((l) => l.status === 'OVERDUE' || (l.dueDate && l.dueDate < todayStr && Number(l.remainingAmount) > 0));
  }
  if (cleanUrl === '/loans') {
    if (verb === 'get') return db.loans;
    if (verb === 'post') {
      const origAmt = parseFloat(data.originalAmount || data.amount || 0);
      const todayStr = new Date().toISOString().split('T')[0];
      const isOverdue = Boolean(data.dueDate && data.dueDate < todayStr);
      const newItem = {
        id: Date.now(),
        personName: (data.personName || data.borrowerName || data.lenderName || 'Unnamed').trim(),
        personPhone: data.personPhone ? data.personPhone.trim() : '',
        type: data.type || 'LENT',
        originalAmount: origAmt,
        remainingAmount: origAmt,
        startDate: data.startDate || todayStr,
        dueDate: data.dueDate || null,
        status: isOverdue ? 'OVERDUE' : 'ACTIVE',
        description: (data.description || data.notes || '').trim(),
        payments: [],
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.loans.unshift(newItem);
      saveDB(db);
      return newItem;
    }
  }

  // Loan Payments: /loans/:id/payments
  const loanPaymentsMatch = cleanUrl.match(/^\/loans\/(\d+)\/payments$/);
  if (loanPaymentsMatch) {
    const loanId = parseInt(loanPaymentsMatch[1], 10);
    const loan = db.loans.find((l) => l.id === loanId);
    if (!loan) return [];

    if (verb === 'get') {
      return loan.payments || [];
    }
    if (verb === 'post') {
      const payAmt = parseFloat(data.amount || 0);
      const currentRem = parseFloat(loan.remainingAmount ?? loan.originalAmount ?? 0);
      const newRem = Math.max(0, currentRem - payAmt);
      loan.remainingAmount = newRem;
      if (newRem === 0) {
        loan.status = 'PAID';
      } else {
        loan.status = 'PARTIALLY_PAID';
      }
      const newPayment = {
        id: Date.now(),
        loanId,
        amount: payAmt,
        paymentDate: data.paymentDate || new Date().toISOString().split('T')[0],
        paymentMethod: data.paymentMethod || 'CASH',
        description: (data.description || '').trim(),
        createdAt: new Date().toISOString(),
      };
      if (!Array.isArray(loan.payments)) loan.payments = [];
      loan.payments.unshift(newPayment);
      saveDB(db);
      return newPayment;
    }
  }

  // Loan Extend Due Date: /loans/:id/extend
  const loanExtendMatch = cleanUrl.match(/^\/loans\/(\d+)\/extend$/);
  if (loanExtendMatch && verb === 'patch') {
    const loanId = parseInt(loanExtendMatch[1], 10);
    const loan = db.loans.find((l) => l.id === loanId);
    if (loan) {
      const newDueDate = data?.newDueDate;
      const oldDueDate = loan.dueDate;
      loan.dueDate = newDueDate;
      const todayStr = new Date().toISOString().split('T')[0];
      if (loan.status === 'OVERDUE' && newDueDate > todayStr) {
        const paidSoFar = (loan.originalAmount || 0) - (loan.remainingAmount || 0);
        loan.status = paidSoFar > 0 ? 'PARTIALLY_PAID' : 'ACTIVE';
      }
      if (!Array.isArray(loan.history)) loan.history = [];
      loan.history.push({
        oldDueDate,
        newDueDate,
        extendedAt: new Date().toISOString(),
      });
      saveDB(db);
      return loan;
    }
  }

  // Loan Status update: /loans/:id/status
  const loanStatusMatch = cleanUrl.match(/^\/loans\/(\d+)\/status$/);
  if (loanStatusMatch && verb === 'patch') {
    const loanId = parseInt(loanStatusMatch[1], 10);
    const loan = db.loans.find((l) => l.id === loanId);
    if (loan && params?.status) {
      loan.status = params.status;
      saveDB(db);
      return loan;
    }
  }

  // Single Loan detail / update / delete: /loans/:id
  const loanSingleMatch = cleanUrl.match(/^\/loans\/(\d+)$/);
  if (loanSingleMatch) {
    const loanId = parseInt(loanSingleMatch[1], 10);
    const loanIndex = db.loans.findIndex((l) => l.id === loanId);
    if (verb === 'get') {
      return db.loans[loanIndex] || null;
    }
    if (verb === 'delete') {
      if (loanIndex !== -1) {
        db.loans.splice(loanIndex, 1);
        saveDB(db);
      }
      return { success: true };
    }
    if (verb === 'put') {
      if (loanIndex !== -1) {
        const existing = db.loans[loanIndex];
        const newOriginal = data.originalAmount ? parseFloat(data.originalAmount) : existing.originalAmount;
        const paidSoFar = Math.max(0, (existing.originalAmount || 0) - (existing.remainingAmount || 0));
        const newRemaining = Math.max(0, newOriginal - paidSoFar);
        const todayStr = new Date().toISOString().split('T')[0];
        let newStatus = existing.status;
        if (newRemaining === 0) {
          newStatus = 'PAID';
        } else if (paidSoFar > 0) {
          newStatus = 'PARTIALLY_PAID';
        } else if (data.dueDate && data.dueDate < todayStr) {
          newStatus = 'OVERDUE';
        } else {
          newStatus = 'ACTIVE';
        }
        db.loans[loanIndex] = {
          ...existing,
          personName: data.personName ? data.personName.trim() : existing.personName,
          personPhone: data.personPhone !== undefined ? (data.personPhone ? data.personPhone.trim() : '') : existing.personPhone,
          type: data.type || existing.type,
          originalAmount: newOriginal,
          remainingAmount: newRemaining,
          startDate: data.startDate || existing.startDate,
          dueDate: data.dueDate !== undefined ? data.dueDate : existing.dueDate,
          description: data.description !== undefined ? data.description.trim() : existing.description,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
        saveDB(db);
        return db.loans[loanIndex];
      }
    }
  }

  // 3. Income
  if (cleanUrl === '/income') {
    if (verb === 'get') return db.income;
    if (verb === 'post') {
      const newItem = { id: Date.now(), incomeDate: new Date().toISOString(), ...data };
      db.income.unshift(newItem);
      saveDB(db);
      return newItem;
    }
  }
  if (cleanUrl.startsWith('/income/')) {
    const id = parseInt(cleanUrl.split('/')[2], 10);
    if (verb === 'delete') {
      db.income = db.income.filter((i) => i.id !== id);
      saveDB(db);
      return { success: true };
    }
    if (verb === 'put') {
      db.income = db.income.map((i) => (i.id === id ? { ...i, ...data } : i));
      saveDB(db);
      return db.income.find((i) => i.id === id);
    }
  }

  // 4. Expenses
  if (cleanUrl === '/expenses') {
    if (verb === 'get') return db.expenses;
    if (verb === 'post') {
      const newItem = { id: Date.now(), expenseDate: new Date().toISOString(), ...data };
      db.expenses.unshift(newItem);
      saveDB(db);
      return newItem;
    }
  }
  if (cleanUrl.startsWith('/expenses/')) {
    const id = parseInt(cleanUrl.split('/')[2], 10);
    if (verb === 'delete') {
      db.expenses = db.expenses.filter((e) => e.id !== id);
      saveDB(db);
      return { success: true };
    }
    if (verb === 'put') {
      db.expenses = db.expenses.map((e) => (e.id === id ? { ...e, ...data } : e));
      saveDB(db);
      return db.expenses.find((e) => e.id === id);
    }
  }

  // 5. Budgets
  if (cleanUrl === '/budgets') {
    if (verb === 'get') return db.budgets;
    if (verb === 'post') {
      const newItem = { id: Date.now(), currentSpent: 0, status: 'NORMAL', ...data };
      db.budgets.push(newItem);
      saveDB(db);
      return newItem;
    }
  }
  if (cleanUrl.startsWith('/budgets/')) {
    const id = parseInt(cleanUrl.split('/')[2], 10);
    if (verb === 'delete') {
      db.budgets = db.budgets.filter((b) => b.id !== id);
      saveDB(db);
      return { success: true };
    }
  }

  // 6. Recurring Expenses
  if (cleanUrl === '/recurring-expenses') {
    if (verb === 'get') return db.recurring;
    if (verb === 'post') {
      const newItem = { id: Date.now(), ...data };
      db.recurring.push(newItem);
      saveDB(db);
      return newItem;
    }
  }

  // 7. Calendar
  if (cleanUrl === '/calendar') {
    return db.calendar;
  }

  // 8. Notifications
  if (cleanUrl === '/notifications/unread') {
    return db.notifications.filter((n) => !n.read);
  }
  if (cleanUrl === '/notifications') {
    return db.notifications;
  }
  if (cleanUrl.startsWith('/notifications/') && cleanUrl.endsWith('/read')) {
    const id = parseInt(cleanUrl.split('/')[2], 10);
    db.notifications = db.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveDB(db);
    return { success: true };
  }
  if (cleanUrl === '/notifications/read-all') {
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
    saveDB(db);
    return { success: true };
  }

  // 9. Reports
  if (cleanUrl.startsWith('/reports/')) {
    return {
      totalIncome: totalInc,
      totalExpenses: totalExp,
      netBalance: Math.max(0, totalInc - totalExp),
      expensesByCategory: db.dashboard.topExpenseCategories,
      monthlyTrend: [
        { month: 'Apr', income: 32000, expenses: 14000 },
        { month: 'May', income: 35000, expenses: 15500 },
        { month: 'Jun', income: 38000, expenses: 16200 },
        { month: 'Jul', income: 40000, expenses: 15800 },
        { month: 'Aug', income: 39000, expenses: 16000 },
        { month: 'Sep', income: totalInc, expenses: totalExp },
      ],
    };
  }

  // 10. User
  if (cleanUrl === '/users/me') {
    try {
      const u = localStorage.getItem('user');
      if (u) return JSON.parse(u);
    } catch {}
    return {
      id: 1,
      name: 'AMAN GUPTA',
      email: 'aman@montra.app',
      accountType: 'STUDENT',
    };
  }

  // Fallback generic empty collection or success
  if (verb === 'get') return [];
  return { success: true };
}
