import { v4 } from 'uuid';
import axios, { AxiosError } from 'axios';

import { env } from '@config';
import { refresh } from './auth';

export const client = axios.create({
  baseURL: env.VITE_NODE_ENV === 'development' ? `${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}` : env.VITE_BACKEND_HOST,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const { url } = config;
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh');
  if (url === '/v1/auth/refresh' && refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  }
  if (url !== '/v1/auth/refresh' && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Request-Id'] = v4();
  return config;
});

client.interceptors.response.use(undefined, async (error: AxiosError) => {
  const { response } = error;
  // Directly return error if
  // 1. It's not authorization related error, i.e. not 401
  // 2. The 401 error is resulted from requesting /v1/auth/refresh
  // Error handling on second 401 error - refresh fail
  if (response?.status !== 401 || (response.config.url === '/v1/auth/refresh' && response?.status === 401)) {
    return Promise.reject(error);
  }
  // Try to refresh token on first 401 error
  const {
    data: { token, refresh: refreshToken },
  } = await refresh();
  localStorage.setItem('token', token);
  localStorage.setItem('refresh', refreshToken);
  // Continue with original request
  return axios.request(response.config);
});
