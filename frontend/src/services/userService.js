import api from '../api/axios';

/* ─── User / Profile service ─── */
export const userService = {
  /** GET /api/users/me */
  getMe: () => api.get('/users/me').then((r) => r.data),

  /** PATCH /api/users/me */
  updateProfile: (payload) => api.patch('/users/me', payload).then((r) => r.data),
};
