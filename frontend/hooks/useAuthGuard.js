'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'

export const useAuthGuard = () => {
  const router = useRouter()
  const { token, logout, setAuth } = useAuthStore()

  const validateSession = useCallback(async () => {
    // No token at all → logout immediately
    if (!token) {
      logout()
      return
    }

    // Check expiry client-side first (fast, no network)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)

      if (payload.exp && payload.exp < now) {
        logout()
        return
      }
    } catch {
      logout()
      return
    }

    // Verify with backend (confirms token hasn't been invalidated)
    try {
      const res = await api.get('/auth/me')
      // Refresh user data in store in case profile was updated
      setAuth(res.data.data, token)
    } catch {
      // Backend rejected token → logout
      logout()
    }
  }, [token, logout, setAuth])

  useEffect(() => {
    // 1. Validate on mount
    validateSession()

    // 2. Validate when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 3. Validate every 5 minutes while active
    const interval = setInterval(validateSession, 5 * 60 * 1000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [validateSession])
}
