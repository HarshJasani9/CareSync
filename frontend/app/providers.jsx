'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export default function Providers({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      />
    </>
  );
}
