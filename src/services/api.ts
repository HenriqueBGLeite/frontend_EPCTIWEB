import axios from 'axios';

const api = axios.create({
  // Desenvolvimento
  // baseURL: 'https://localhost:44318/api/',
  // Homologação
  baseURL: 'http://192.168.0.118:84/api/',
  // Produção
  // baseURL: 'http://192.168.0.118:83/api/',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@EpocaWeb:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (err) => {
    const responseErr = err.response || null;

    if (responseErr) {
      if (err.response.status === 401) {
        localStorage.removeItem('@EpocaWeb:token');
        localStorage.removeItem('@EpocaWeb:user');
        window.location.href = '/';

        return Promise.reject(err);
      }
      if (err.response.status === 500) {
        return Promise.reject(err);
      }
    }

    if (err.message === 'Network Error') {
      err.message =
        'Não foi possível conectar com o banco de dados. Verifique sua conexão e tente novamente.';
      return Promise.reject(err);
    }

    return Promise.reject(err);
  },
);

export default api;
