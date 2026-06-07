import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
// Attach Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    // Read from localStorage (works client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cl_token')
      if (token) {
        // Check if token is expired BEFORE sending the request
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const now = Math.floor(Date.now() / 1000)

          if (payload.exp && payload.exp < now) {
            // Token expired — clear everything and redirect
            localStorage.removeItem('cl_token')
            document.cookie = 'cl_token=; path=/; max-age=0'
            window.location.href = '/login?reason=expired'
            return Promise.reject(new Error('Token expired'))
          }

          config.headers.Authorization = `Bearer ${token}`
        } catch {
          // Malformed token — clear and redirect
          localStorage.removeItem('cl_token')
          document.cookie = 'cl_token=; path=/; max-age=0'
          window.location.href = '/login?reason=invalid'
          return Promise.reject(new Error('Invalid token'))
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
// Handle auth errors returned by the backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

    // 401 — Unauthorized (token rejected by backend)
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cl_token')
        document.cookie = 'cl_token=; path=/; max-age=0'

        // Don't redirect if already on login page (prevents loops)
        if (!currentPath.includes('/login')) {
          window.location.href = `/login?reason=unauthorized&callbackUrl=${currentPath}`
        }
      }
    }

    // 403 — Forbidden (wrong role)
    if (status === 403) {
      if (typeof window !== 'undefined' && !currentPath.includes('/login')) {
        window.location.href = '/login?reason=forbidden'
      }
    }

    return Promise.reject(error)
  }
)

export default api
