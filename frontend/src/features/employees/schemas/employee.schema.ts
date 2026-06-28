/**
 * features/employees/schemas/employee.schema.ts
 *
 * Zod schemas that mirror the backend CreateEmployeeDto / UpdateEmployeeDto /
 * CreateSalaryRecordDto exactly. Used by react-hook-form via zodResolver.
 *
 * Note: zod v4 is installed. z.infer<> works identically to v3.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared enum schemas
// ---------------------------------------------------------------------------

const employmentStatusSchema = z.enum(['ACTIVE', 'DEACTIVE']);
const employmentTypeSchema = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'INTERN',
]);

// ---------------------------------------------------------------------------
// Create Employee
// ---------------------------------------------------------------------------

export const createEmployeeSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters').max(150),
  email:        z.string().email('Invalid email address'),
  departmentId: z.string().uuid('Please select a department'),
  roleId:       z.string().uuid('Please select a role'),
  countryId:    z.string().uuid('Please select a country'),
  status:       employmentStatusSchema,
  type:         employmentTypeSchema,
  salary: z
    .number({ invalid_type_error: 'Salary must be a number' })
    .positive('Salary must be greater than 0'),
  effectiveDate: z.string().optional(), // ISO date string from the date input
});

export type CreateEmployeeValues = z.infer<typeof createEmployeeSchema>;

// ---------------------------------------------------------------------------
// Update Employee
// (salary + effectiveDate are excluded — handled via a separate salary form)
// ---------------------------------------------------------------------------

export const updateEmployeeSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters').max(150).optional(),
  email:        z.string().email('Invalid email address').optional(),
  departmentId: z.string().uuid('Please select a department').optional(),
  roleId:       z.string().uuid('Please select a role').optional(),
  countryId:    z.string().uuid('Please select a country').optional(),
  status:       employmentStatusSchema,
  type:         employmentTypeSchema,
});

export type UpdateEmployeeValues = z.infer<typeof updateEmployeeSchema>;

// ---------------------------------------------------------------------------
// Add Salary Record
// ---------------------------------------------------------------------------

export const addSalarySchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Salary must be greater than 0'),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required'),
});

export type AddSalaryValues = z.infer<typeof addSalarySchema>;
