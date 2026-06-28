/**
 * components/shared/TopHeader.tsx
 *
 * 52px fixed header bar containing:
 *   - SidebarTrigger (hamburger / collapse toggle)
 *   - Separator (vertical)
 *   - Breadcrumb (derived from current route — no state, no effect)
 *   - Dark mode toggle
 *   - HR avatar
 *
 * Vercel React skill rules applied:
 *   - rerender-derived-state-no-effect: breadcrumb items derived directly
 *     during render from useLocation() — no useState/useEffect needed.
 *   - rerender-no-inline-components: ROUTE_LABELS is module-level.
 *   - js-set-map-lookups: O(1) label lookup via plain object map.
 *
 * shadcn skill rules applied:
 *   - Use <Separator> not <hr> or div with border-t
 *   - Semantic tokens only — no raw color classes
 *   - cn() for conditional classes
 *   - No manual z-index
 */

import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';
import { getInitials } from '@/lib/formatters';

// ── Route label map at module level (O(1) lookup, rerender-no-inline-components) ──
const ROUTE_LABELS: Record<string, string> = {
  dashboard:   'Dashboard',
  employees:   'Employees',
  departments: 'Departments',
  roles:       'Roles',
  analytics:   'Analytics',
};

const HR_NAME = 'HR';

export function TopHeader() {
  const { pathname } = useLocation();
  const { isDark, toggle } = useDarkMode();

  // Derive breadcrumb segments during render — no effect, no state
  // (rerender-derived-state-no-effect)
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const label = ROUTE_LABELS[seg] ?? seg;
    const path  = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    return { label, path, isLast };
  });

  return (
    <header
      className="flex h-[52px] shrink-0 items-center gap-2 border-b border-border bg-background px-4"
      aria-label="Top navigation"
    >
      {/* Sidebar collapse toggle */}
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="h-4" />

      {/* Breadcrumb — derived from route, no state needed */}
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.length === 0 ? (
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            crumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Spacer */}
      <div className="flex-1" aria-hidden="true" />

      {/* Dark mode toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="size-8"
      >
        {isDark
          ? <Sun className="size-4" aria-hidden="true" />
          : <Moon className="size-4" aria-hidden="true" />
        }
      </Button>

      {/* HR avatar */}
      <div
        className="flex size-7 items-center justify-center rounded-full bg-bg-success text-[11px] font-medium text-text-success select-none"
        aria-label={HR_NAME}
        title={HR_NAME}
      >
        {getInitials(HR_NAME)}
      </div>
    </header>
  );
}
