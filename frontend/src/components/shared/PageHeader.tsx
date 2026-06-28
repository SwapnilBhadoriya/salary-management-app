/**
 * components/shared/PageHeader.tsx
 *
 * Reusable page header with title, subtitle, and an optional action slot.
 * Used at the top of every feature page.
 *
 * shadcn skill: className for layout only, semantic tokens for color.
 * Vercel skill: rerender-no-inline-components — no nested component defs.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-heading-lg text-foreground">{title}</h1>
        {description && (
          <p className="text-body-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
