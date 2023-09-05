import axios from 'axios';

const BACKEND_HOST: String = import.meta.env.VITE_BACKEND_HOST;
const BACKEND_PORT: String = import.meta.env.VITE_BACKEND_PORT;

export const client = axios.create({
  baseURL: `${BACKEND_HOST}:${BACKEND_PORT}`,
  withCredentials: true,
});
