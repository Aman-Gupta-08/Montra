import axios from 'axios';
import { handleMockRequest } from './mockDataStore';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api')) {
      clean += '/api';
    }
    return clean;
  }
  if (
    typeof window !== 'undefined' &&
    (window.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:')
  ) {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout for mobile network latency and cloud service wake-up
});

// Request interceptor – attach JWT from localStorage or sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If active session is Demo Mode and not auth login/register, serve mock immediately
    if (token === 'mock-jwt-token-demo' && !config.url?.startsWith('/auth/')) {
      const mockResult = handleMockRequest(config.url, config.method, config.data, config.params);
      config.adapter = () =>
        Promise.resolve({
          data: mockResult,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;

    // Check if network error or backend offline (404/500/502/ECONNREFUSED/ERR_NETWORK)
    const isNetworkOrOffline =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      String(error.message || '').includes('Network Error') ||
      error.response?.status === 404 ||
      error.response?.status === 502;

    if (isNetworkOrOffline && config && !config.url?.startsWith('/auth/')) {
      console.warn(`[Montra Mock Fallback] ${config.method?.toUpperCase()} ${config.url}`);
      const mockResult = handleMockRequest(config.url, config.method, config.data, config.params);
      return Promise.resolve({
        data: mockResult,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    }

    // Auto-logout on 401 Unauthorized or auth-related 403 (token expired / invalid)
    const isAuthError =
      error.response &&
      (error.response.status === 401 ||
        (error.response.status === 403 &&
          (window.location.pathname.includes('/dashboard') ||
            !localStorage.getItem('token') ||
            String(error.response.data?.message || '').toLowerCase().includes('token') ||
            String(error.response.data?.message || '').toLowerCase().includes('expired') ||
            String(error.response.data?.message || '').toLowerCase().includes('unauthorized') ||
            String(error.response.data?.message || '').toLowerCase().includes('authentication'))));

    if (isAuthError && localStorage.getItem('token') !== 'mock-jwt-token-demo') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Preserve `code` (e.g. 'ERR_NETWORK') so offline detection works in services
    const enriched = new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred. Please try again.'
    );
    enriched.code = error.code;
    enriched.response = error.response;
    enriched.status = error.response?.status;

    return Promise.reject(enriched);
  }
);

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error };
  }
};

export default api;
