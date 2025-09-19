import axios from 'axios';


const resolveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  // fallback to same-origin backend in dev if proxying, else default localhost:8080
  if (typeof window !== 'undefined') {
    const sameOrigin = `${window.location.protocol}//${window.location.hostname}:8080`;
    return sameOrigin;
  }
  return 'http://localhost:8080';
};

const api = axios.create({
  baseURL: resolveBaseURL(),
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
