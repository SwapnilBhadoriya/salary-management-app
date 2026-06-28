/**
 * features/departments/hooks/queryKeys.ts
 *
 * Query key factory for Department queries.
 */

export const departmentKeys = {
  all: ['departments'] as const,
  list: () => ['departments', 'list'] as const,
  detail: (id: string) => ['departments', 'detail', id] as const,
} as const;
