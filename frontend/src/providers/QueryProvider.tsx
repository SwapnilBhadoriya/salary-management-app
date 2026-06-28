/**
 * providers/QueryProvider.tsx
 *
 * Root provider that wraps the app with:
 *  - TanStack Query (server state)
 *  - ReactQueryDevtools (dev only — tree-shaken in production)
 *  - TooltipProvider (shadcn requirement for tooltip components)
 *  - Toaster from sonner (global toast notifications)
 *
 * Skill rules applied:
 *   - advanced-init-once: QueryClient is created at module level —
 *     a single stable instance across the entire app, never recreated.
 *   - bundle-conditional: devtools are wrapped in NODE_ENV check
 *     so they are excluded from the production bundle.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

// Single shared QueryClient — created once at module level
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s — data stays fresh without refetch
      retry: 1,                 // retry once on error
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* TooltipProvider required by shadcn — wraps at root level */}
      <TooltipProvider delayDuration={300}>
        {children}
        {/* Toaster renders toast notifications from any component via sonner */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'var(--font-sans)' },
          }}
        />
      </TooltipProvider>
      {/* Devtools only bundled in development — bundle-conditional rule */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
