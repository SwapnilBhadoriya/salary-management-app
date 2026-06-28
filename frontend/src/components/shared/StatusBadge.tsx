/**
 * components/shared/StatusBadge.tsx
 *
 * Renders an EmploymentStatus value as a color-coded shadcn Badge.
 *
 * Design system mapping:
 *   ACTIVE   → bg-success / text-success (green)
 *   DEACTIVE → surface-1 / text-muted   (neutral gray)
 *
 * shadcn skill rules:
 *   - Use <Badge> not custom styled spans
 *   - Semantic tokens only — no raw colors
 *
 * Vercel skill rules:
 *   - js-set-map-lookups: O(1) class lookup via CONFIG object
 *   - rerender-no-inline-components: CONFIG is module-level
 */

import { Badge } from '@/components/ui/badge';
import { Circle, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatStatus } from '@/lib/formatters';
import type { EmploymentStatus } from '@/types/api';

// Module-level config — O(1) lookup, no re-creation per render
const STATUS_CONFIG: Record<
  EmploymentStatus,
  { className: string; Icon: typeof Circle }
> = {
  ACTIVE: {
    className: 'bg-bg-success text-text-success border-transparent hover:bg-bg-success',
    Icon: CircleDot,
  },
  DEACTIVE: {
    className: 'bg-bg-neutral text-muted-foreground border-border hover:bg-bg-neutral',
    Icon: Circle,
  },
};

interface StatusBadgeProps {
  status: EmploymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { className: colorClass, Icon } = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn('gap-1 font-medium', colorClass, className)}
    >
      <Icon className="size-3" aria-hidden="true" />
      {formatStatus(status)}
    </Badge>
  );
}
