import api from '../api/axios';

export const reportService = {
  /** GET /api/reports/weekly */
  getWeekly: () => api.get('/reports/weekly').then((r) => r.data),

  /** GET /api/reports/monthly */
  getMonthly: () => api.get('/reports/monthly').then((r) => r.data),

  /** GET /api/reports/yearly */
  getYearly: () => api.get('/reports/yearly').then((r) => r.data),

  /** GET /api/reports/custom?startDate=...&endDate=... */
  getCustom: (startDate, endDate) =>
    api.get('/reports/custom', { params: { startDate, endDate } }).then((r) => r.data),

  /** GET /api/business/dashboard (for BUSINESS_OWNER) */
  getBusinessReport: () => api.get('/business/dashboard').then((r) => r.data),
};
