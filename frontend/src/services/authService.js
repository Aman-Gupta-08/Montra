import api from '../api/axios.js';

/**
 * Montra Authentication Service
 * Centralizes auth API calls and guarantees the request payload
 * matches backend DTO requirements (LoginRequest: { email, password }).
 */
export const authService = {
  /**
   * Log in user with credentials.
   * Supports both object format ({ email/emailOrPhone, password }) and positional arguments (email, password).
   * Guarantees { email, password } JSON payload with explicit Content-Type.
   *
   * @param {Object|string} credentialsOrEmail
   * @param {string} [optionalPassword]
   * @returns {Promise<any>}
   */
  login: async (credentialsOrEmail, optionalPassword) => {
    let email = '';
    let password = '';

    if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
      email = credentialsOrEmail.email || credentialsOrEmail.emailOrPhone || '';
      password = credentialsOrEmail.password || '';
    } else {
      email = credentialsOrEmail || '';
      password = optionalPassword || '';
    }

    const payload = {
      email: String(email || '').trim(),
      password: String(password || ''),
    };

    const response = await api.post('/auth/login', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  /**
   * Register a new user account.
   *
   * @param {Object} userData
   * @returns {Promise<any>}
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  /**
   * Log out user.
   *
   * @returns {Promise<any>}
   */
  logout: async () => {
    return api.post('/auth/logout');
  },
};

export default authService;
