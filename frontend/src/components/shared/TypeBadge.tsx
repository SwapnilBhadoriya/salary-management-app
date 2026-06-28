/**
 * components/shared/TypeBadge.tsx
 *
 * Renders an EmploymentType value as a color-coded shadcn Badge.
 *
 * Design system mapping:
 *   FULL_TIME   → bg-accent  / text-accent  (blue)
 *   PART_TIME   → bg-neutral / text-secondary (gray)
 *   CONTRACTOR  → bg-warning / text-warning  (amber)
 *   INTERN      → bg-pro     / text-pro      (purple)
 *
 * shadcn + Vercel skill rules:
 *   - Use <Badge> not custom spans
 *   - O(1) config lookup (js-set-map-lookups)
 *   - Module-level config (rerender-no-inline-components)
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatType } from '@/lib/formatters';
import type { EmploymentType } from '@/types/api';

// Module-level O(1) lookup
const TYPE_CONFIG: Record<EmploymentType, string> = {
  FULL_TIME:  'bg-bg-accent   text-text-accent   border-transparent hover:bg-bg-accent',
  PART_TIME:  'bg-bg-neutral  text-text-secondary border-transparent hover:bg-bg-neutral',
  CONTRACTOR: 'bg-bg-warning  text-text-warning   border-transparent hover:bg-bg-warning',
  INTERN:     'bg-bg-pro      text-text-pro       border-transparent hover:bg-bg-pro',
};

interface TypeBadgeProps {
  type: EmploymentType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', TYPE_CONFIG[type], className)}
    >
      {formatType(type)}
    </Badge>
  );
}
