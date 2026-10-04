import api from '../api/axios';

/* ─── Income ─── */
export const incomeService = {
  getAll: () => api.get('/income').then((r) => r.data),
  getById: (id) => api.get(`/income/${id}`).then((r) => r.data),
  create: (payload) => api.post('/income', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/income/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/income/${id}`),
};

/* ─── Expenses ─── */
export const expenseService = {
  getAll: () => api.get('/expenses').then((r) => r.data),
  getById: (id) => api.get(`/expenses/${id}`).then((r) => r.data),
  create: (payload) => api.post('/expenses', payload).then((r) => r.data),
  update: (id, payload) => api.put(`/expenses/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/expenses/${id}`),
};

/* ─── Attachments ─── */
export const attachmentService = {
  /**
   * Upload a file via multipart/form-data.
   * Returns the Attachment entity from the backend (with .id).
   */
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api
      .post('/attachments/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  getById: (id) => api.get(`/attachments/${id}`).then((r) => r.data),
};
