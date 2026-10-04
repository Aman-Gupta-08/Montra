import api from '../api/axios';

export const dashboardService = {
  /** GET /api/dashboard — returns DashboardResponse */
  getDashboard: () => api.get('/dashboard').then((r) => r.data),

  /** GET /api/business/dashboard — returns BusinessDashboardResponse */
  getBusinessDashboard: () => api.get('/business/dashboard').then((r) => r.data),
};

export const notificationService = {
  /** GET /api/notifications/unread */
  getUnread: () => api.get('/notifications/unread').then((r) => r.data),

  /** GET /api/notifications */
  getAll: () => api.get('/notifications').then((r) => r.data),

  /** PATCH /api/notifications/:id/read */
  markRead: (id) =>
    api.patch(`/notifications/${id}/read`).then((r) => {
      notifyChange();
      return r.data;
    }),

  /** PATCH /api/notifications/read-all */
  markAllRead: () =>
    api.patch('/notifications/read-all').then((r) => {
      notifyChange();
      return r.data;
    }),
};

const notifyChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('montra:notifications-changed'));
  }
};
