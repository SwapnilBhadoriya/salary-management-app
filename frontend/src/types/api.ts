/**
 * api.ts
 * Canonical TypeScript types for all API request/response shapes.
 * These mirror the backend Prisma models and NestJS DTOs exactly.
 * Decimal fields (e.g. SalaryRecord.amount) are typed as `string`
 * because Prisma serialises Decimal → string over JSON.
 */

// ---------------------------------------------------------------------------
// Enums (mirrored from backend enums directory)
// ---------------------------------------------------------------------------

export type EmploymentStatus = 'ACTIVE' | 'DEACTIVE';

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACTOR'
  | 'INTERN';

// ---------------------------------------------------------------------------
// Reference / Lookup Entities
// ---------------------------------------------------------------------------

export interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  createdAt: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // e.g. "US", "IN"
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Salary Record
// ---------------------------------------------------------------------------

export interface SalaryRecord {
  id: string;
  employeeId: string;
  /** Prisma Decimal serialised as string over JSON — parse with parseFloat() before display */
  amount: string;
  effectiveDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Employee
// ---------------------------------------------------------------------------

export interface Employee {
  id: string;
  /** Business-facing ID in format EMP-XXXXX */
  employeeId: string;
  name: string;
  email: string;
  status: EmploymentStatus;
  type: EmploymentType;
  departmentId: string;
  department: Department;
  roleId: string;
  role: Role;
  countryId: string;
  country: Country;
  /** Latest salary record effective on or before today. Null if none. */
  currentSalary: SalaryRecord | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Paginated Response Wrapper
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// API Error Shape (NestJS default)
// ---------------------------------------------------------------------------

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ---------------------------------------------------------------------------
// Request Payload Types (aligned with backend DTOs)
// ---------------------------------------------------------------------------

export interface CreateEmployeePayload {
  name: string;
  email: string;
  departmentId: string;
  roleId: string;
  countryId: string;
  status: EmploymentStatus;
  type: EmploymentType;
  salary: number;
  effectiveDate?: string; // ISO date string — optional, defaults to today
}

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  departmentId?: string;
  roleId?: string;
  countryId?: string;
  status: EmploymentStatus;
  type: EmploymentType;
}

export interface AddSalaryPayload {
  amount: number;
  effectiveDate: string; // ISO date string — required by backend
}

export interface CreateDepartmentPayload {
  name: string;
}

export interface UpdateDepartmentPayload {
  name: string;
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name: string;
}

// ---------------------------------------------------------------------------
// Employee List Query Parameters
// ---------------------------------------------------------------------------

export interface EmployeeListParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  roleId?: string;
  countryId?: string;
  status?: EmploymentStatus | '';
  type?: EmploymentType | '';
}
