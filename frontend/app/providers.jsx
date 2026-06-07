'use client';

import { useEffect, Suspense } from 'react';
import { Toaster, toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { ThemeProvider } from 'next-themes';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function ErrorToaster() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      toast.error('You are not authorized to access that page.');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('error');
      const newUrl = pathname + (newParams.toString() ? `?${newParams.toString()}` : '');
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}

export default function Providers({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
      <Suspense fallback={null}>
        <ErrorToaster />
      </Suspense>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      />
    </ThemeProvider>
  );
}
