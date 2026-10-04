import api from '../api/axios';

/* ─── Business & Transactions API ─── */
export const businessService = {
  get: () => api.get('/business').then((r) => r.data),
  create: (payload) => api.post('/business', payload).then((r) => r.data),
  update: (payload) => api.put('/business', payload).then((r) => r.data),
  remove: () => api.delete('/business').then((r) => r.data),
  getDashboard: () => api.get('/business/dashboard').then((r) => r.data),

  // Transactions
  getTransactions: () => api.get('/business/transactions').then((r) => r.data),
  addSale: (payload) => api.post('/business/sales', payload).then((r) => r.data),
  addExpense: (payload) => api.post('/business/expenses', payload).then((r) => r.data),
  updateTransaction: (id, payload) => api.put(`/business/transactions/${id}`, payload).then((r) => r.data),
  deleteTransaction: (id) => api.delete(`/business/transactions/${id}`).then((r) => r.data),
};

/* ─── Staff API ─── */
export const staffService = {
  getAll: () => api.get('/staff').then((r) => r.data),
  getById: (id) => api.get(`/staff/${id}`).then((r) => r.data),
  create: (payload) => api.post('/staff', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/staff/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/staff/${id}`).then((r) => r.data),
};

/* ─── Salary API ─── */
export const salaryService = {
  getStaffHistory: (staffId) => api.get(`/salary/staff/${staffId}`).then((r) => r.data),
  initSalary: (staffId) => api.post(`/salary/staff/${staffId}/init`).then((r) => r.data),
  getPending: () => api.get('/salary/pending').then((r) => r.data),
  getPaid: () => api.get('/salary/paid').then((r) => r.data),
  paySalary: (id, payload) => api.patch(`/salary/${id}/pay`, payload).then((r) => r.data),
};
