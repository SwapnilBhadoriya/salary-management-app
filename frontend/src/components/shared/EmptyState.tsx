/**
 * components/shared/EmptyState.tsx
 *
 * Displayed when a table/list has no data to show.
 * Provides a contextual message and optional CTA button.
 *
 * shadcn skill: no custom markup for empty states — uses Card composition.
 */

import type { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your filters or add a new record.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center',
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <InboxIcon className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-heading-sm text-foreground">{title}</p>
        <p className="text-body-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
