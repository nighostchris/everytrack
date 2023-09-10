import axios from 'axios';

import { env } from '@config';

export const client = axios.create({
  baseURL: env.VITE_NODE_ENV === 'development' ? `${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}` : env.VITE_BACKEND_HOST,
  withCredentials: true,
});
