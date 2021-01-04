import axios from 'axios';

const urlRelatorio = axios.create({
  baseURL: 'http://192.168.0.232:40083/',
});

urlRelatorio.interceptors.request.use(async (config) => {
  const username = 'servrel';
  const password = 's3rvr3l';

  const token = Buffer.from(`${username}:${password}`, 'utf8').toString(
    'base64',
  );

  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

urlRelatorio.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (err) => {
    return Promise.reject(err);
  },
);

export default urlRelatorio;
