import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import api from '../api/axios.js';
import { authService } from './authService.js';

describe('authService', () => {
  test('login sends correct { email, password } body and Content-Type when given object with email', async () => {
    let capturedConfig = null;
    const originalPost = api.post;

    api.post = async (url, data, config) => {
      capturedConfig = { url, data, config };
      return { data: { token: 'mock-jwt-token', user: { id: 1, email: data.email, name: 'Tester' } } };
    };

    try {
      const result = await authService.login({
        email: '  user@montra.app  ',
        password: 'Password123!',
      });

      assert.equal(capturedConfig.url, '/auth/login');
      assert.deepEqual(capturedConfig.data, {
        email: 'user@montra.app',
        password: 'Password123!',
      });
      assert.equal(capturedConfig.config.headers['Content-Type'], 'application/json');
      assert.equal(result.token, 'mock-jwt-token');
      assert.equal(result.user.email, 'user@montra.app');
    } finally {
      api.post = originalPost;
    }
  });

  test('login correctly maps emailOrPhone to email in payload', async () => {
    let capturedConfig = null;
    const originalPost = api.post;

    api.post = async (url, data, config) => {
      capturedConfig = { url, data, config };
      return { data: { token: 'mock-jwt-token', user: { id: 2, email: data.email } } };
    };

    try {
      await authService.login({
        emailOrPhone: 'user@example.com',
        password: 'SecurePass456!',
      });

      assert.deepEqual(capturedConfig.data, {
        email: 'user@example.com',
        password: 'SecurePass456!',
      });
      assert.equal(capturedConfig.config.headers['Content-Type'], 'application/json');
    } finally {
      api.post = originalPost;
    }
  });

  test('login supports positional arguments (email, password)', async () => {
    let capturedConfig = null;
    const originalPost = api.post;

    api.post = async (url, data, config) => {
      capturedConfig = { url, data, config };
      return { data: { token: 'mock-jwt-token', user: { id: 3, email: data.email } } };
    };

    try {
      await authService.login('positional@montra.app', 'PositionalPass!');

      assert.deepEqual(capturedConfig.data, {
        email: 'positional@montra.app',
        password: 'PositionalPass!',
      });
      assert.equal(capturedConfig.config.headers['Content-Type'], 'application/json');
    } finally {
      api.post = originalPost;
    }
  });

  test('login guarantees email and password fields are present even if empty', async () => {
    let capturedConfig = null;
    const originalPost = api.post;

    api.post = async (url, data, config) => {
      capturedConfig = { url, data, config };
      return { data: { token: 'mock-jwt-token' } };
    };

    try {
      await authService.login({});

      assert.deepEqual(capturedConfig.data, {
        email: '',
        password: '',
      });
      assert.ok('email' in capturedConfig.data);
      assert.ok('password' in capturedConfig.data);
    } finally {
      api.post = originalPost;
    }
  });

  test('register sends JSON body and Content-Type', async () => {
    let capturedConfig = null;
    const originalPost = api.post;

    api.post = async (url, data, config) => {
      capturedConfig = { url, data, config };
      return { data: { token: 'reg-token', user: data } };
    };

    try {
      const regData = {
        name: 'New User',
        email: 'new@montra.app',
        phone: '1234567890',
        password: 'Password123!',
        userType: 'STUDENT',
      };
      await authService.register(regData);

      assert.equal(capturedConfig.url, '/auth/register');
      assert.deepEqual(capturedConfig.data, regData);
      assert.equal(capturedConfig.config.headers['Content-Type'], 'application/json');
    } finally {
      api.post = originalPost;
    }
  });
});
