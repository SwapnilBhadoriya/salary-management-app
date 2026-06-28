/**
 * layouts/AppLayout.tsx
 *
 * Application shell — renders the sidebar + header + main content area.
 * All routes are rendered inside <Outlet /> within this layout.
 *
 * Structure:
 *   SidebarProvider
 *     AppSidebar   (left rail)
 *     SidebarInset (main content area — handles margin-left automatically)
 *       TopHeader
 *       <main>
 *         Suspense (Outlet renders lazy pages here)
 *
 * Skill rules applied:
 *   - async-suspense-boundaries: Suspense wraps the Outlet so each lazy
 *     page streams independently with a skeleton fallback.
 *   - rendering-usetransition-loading: navigation transitions use
 *     useNavigation().state === 'loading' for pending UI feedback.
 */

import { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { TopHeader } from '@/components/shared/TopHeader';
import { PageSkeleton } from '@/components/shared/PageSkeleton';
import { cn } from '@/lib/utils';

export function AppLayout() {
  // Detect in-flight navigation for subtle pending state
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Fixed 52px top bar */}
        <TopHeader />

        {/* Page content area */}
        <main
          className={cn(
            'flex flex-1 flex-col bg-background transition-opacity duration-150',
            isNavigating && 'opacity-60'
          )}
          aria-busy={isNavigating}
        >
          {/* Suspense boundary for lazy-loaded pages */}
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
