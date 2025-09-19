import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const setAuthInterceptor = (onError) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (onError) {
        onError(error);
      }
      return Promise.reject(error);
    },
  );
};

export default api;
