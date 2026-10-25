import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://server.macrobytetrade.com/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('mb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
