import api from '../api/axios';

/* ─── Recurring Expenses ─── */
export const recurringService = {
  getAll: () => api.get('/recurring-expenses').then((r) => r.data),
  create: (payload) => api.post('/recurring-expenses', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/recurring-expenses/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/recurring-expenses/${id}`),
  toggle: (id) => api.patch(`/recurring-expenses/${id}/toggle`).then((r) => r.data),
};

/* ─── Loans ─── */
export const loanService = {
  getAll: () => api.get('/loans').then((r) => r.data),
  getById: (id) => api.get(`/loans/${id}`).then((r) => r.data),
  getLent: () => api.get('/loans/lent').then((r) => r.data),
  getBorrowed: () => api.get('/loans/borrowed').then((r) => r.data),
  getOverdue: () => api.get('/loans/overdue').then((r) => r.data),
  create: (payload) => api.post('/loans', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/loans/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/loans/${id}`),

  /* Payments */
  addPayment: (id, payload) => api.post(`/loans/${id}/payments`, payload).then((r) => r.data),
  getPayments: (id) => api.get(`/loans/${id}/payments`).then((r) => r.data),

  /* Extend due date */
  extendDueDate: (id, newDueDate) =>
    api.patch(`/loans/${id}/extend`, { newDueDate }).then((r) => r.data),

  /* Status update */
  updateStatus: (id, status) =>
    api.patch(`/loans/${id}/status`, null, { params: { status } }).then((r) => r.data),
};
