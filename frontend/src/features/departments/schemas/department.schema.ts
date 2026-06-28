/**
 * features/departments/schemas/department.schema.ts
 *
 * Zod schemas for Department create/update DTOs.
 */

import { z } from 'zod';

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, 'Department name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .transform((val) => val.trim()),
});

export type DepartmentValues = z.infer<typeof departmentSchema>;
