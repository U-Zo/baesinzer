import axios from 'axios';

export const check = () => axios.get('/api/auth/check');

export const login = ({ email, password }) =>
  axios.post('/api/auth/login', { email, password });

export const register = ({ email, password }) =>
  axios.post('/api/auth/register ', { email, password });
