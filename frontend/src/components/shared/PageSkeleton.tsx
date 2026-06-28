/**
 * components/shared/PageSkeleton.tsx
 *
 * Full-page loading skeleton used as the Suspense fallback while
 * lazy page chunks are being downloaded.
 *
 * shadcn skill rules applied:
 *   - Use <Skeleton> not custom animate-pulse divs
 *   - No space-y-* — use flex flex-col gap-*
 */

import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6" aria-label="Loading page" aria-live="polite">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Table skeleton */}
      <div className="flex flex-col gap-0 rounded-lg border border-border overflow-hidden">
        {/* Table header */}
        <div className="flex gap-4 px-4 py-3 bg-muted border-b border-border">
          {[28, 18, 14, 16, 12, 12].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 px-4 border-b border-border last:border-0"
            style={{ height: '52px', alignItems: 'center' }}
          >
            <Skeleton className="h-4" style={{ width: '28%' }} />
            <Skeleton className="h-4" style={{ width: '18%' }} />
            <Skeleton className="h-4" style={{ width: '14%' }} />
            <Skeleton className="h-4" style={{ width: '16%' }} />
            <Skeleton className="h-5 rounded-full" style={{ width: '10%' }} />
            <Skeleton className="h-5 rounded-full" style={{ width: '10%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
