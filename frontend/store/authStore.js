import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isLoading: true,

  // Called after login/register — persists token to localStorage + cookie
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cl_token', token);
      document.cookie = `cl_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
    set({ user, token, role: user?.role || null, isLoading: false });
  },

  // Update just the user data without modifying the token
  setUser: (userData) => {
    set((state) => ({ user: { ...state.user, ...userData } }));
  },

  // Clear all auth state and redirect to login
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cl_token');
      document.cookie = 'cl_token=; path=/; max-age=0';
      window.location.href = '/login';
    }
    set({ user: null, token: null, role: null, isLoading: false });
  },

    // Hydrate auth state from localStorage on app mount
  initAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cl_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          set({
            user: { id: payload.id, role: payload.role },
            token,
            role: payload.role,
            isLoading: false,
          });

          // Fetch full user profile asynchronously
          const api = require('@/lib/axios').default;
          try {
             const res = await api.get('/auth/me');
             set((state) => ({ user: { ...state.user, ...res.data.data } }));
          } catch (err) {
             console.error('Failed to fetch full user profile');
          }
        } catch {
          localStorage.removeItem('cl_token');
          document.cookie = 'cl_token=; path=/; max-age=0';
          set({ user: null, token: null, role: null, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    }
  },
}));
