import api from '../api/axios';

/* ─── Budgets API ─── */
export const budgetService = {
  getAll: () => api.get('/budgets').then((r) => r.data),
  getById: (id) => api.get(`/budgets/${id}`).then((r) => r.data),
  create: (payload) => api.post('/budgets', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/budgets/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/budgets/${id}`).then((r) => r.data),
};

/* ─── Calendar API ─── */
export const calendarService = {
  getEvents: (params = {}) => api.get('/calendar', { params }).then((r) => r.data),
};
