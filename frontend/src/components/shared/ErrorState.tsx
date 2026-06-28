/**
 * components/shared/ErrorState.tsx
 *
 * Displayed when a query fails. Shows error message and a retry button.
 *
 * Vercel skill: rerender-move-effect-to-event — retry is an event
 * handler, not a useEffect trigger.
 */

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg border border-border px-6 py-16 text-center',
        className
      )}
      role="alert"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-bg-danger">
        <AlertTriangle className="size-6 text-text-danger" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-heading-sm text-foreground">{title}</p>
        <p className="text-body-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
