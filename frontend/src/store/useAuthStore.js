import { create } from 'zustand';

import api from '../lib/api.js';
import { loginShape } from '../lib/shapes.js';

export const useAuthStore = create((set) => ({
  user: null,
  role: 'admin',
  loading: false,
  error: null,
  setRole: (role) => set({ role }),
  fetchMe: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get('/api/auth/me');
      set({ user: data, role: data.role, loading: false, error: null });
      return data;
    } catch (error) {
      set({ loading: false, error: error.message });
      return null;
    }
  },
  login: async (payload) => {
    const parsed = loginShape.safeParse(payload);
    if (!parsed.success) {
      set({ error: 'Invalid form input' });
      return null;
    }
    try {
      set({ loading: true });
      const { data } = await api.post('/api/auth/login', parsed.data);
      set({ user: data, role: data.role, loading: false, error: null });
      return data;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Login failed' });
      return null;
    }
  },
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      set({ user: null, role: 'customer' });
    }
  },
}));
