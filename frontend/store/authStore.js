import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  isLoading: true,

  // Called after login/register — persists token to localStorage
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cl_token', token);
      // Also store token as a cookie so Next.js middleware can read it
      document.cookie = `cl_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
    set({ user, token, role: user?.role || null, isLoading: false });
  },

  // Clear all auth state
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cl_token');
      document.cookie = 'cl_token=; path=/; max-age=0';
    }
    set({ user: null, token: null, role: null, isLoading: false });
  },

  // Hydrate auth state from localStorage on app mount
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cl_token');
      if (token) {
        try {
          // Decode the JWT payload (middle segment) to extract user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          set({
            user: { id: payload.id, role: payload.role },
            token,
            role: payload.role,
            isLoading: false,
          });
        } catch {
          // Corrupted token — clear everything
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
