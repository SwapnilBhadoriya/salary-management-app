# Implementation Plan — Role Module TDD Development

Implement the Role management module for the ACME Salary Management System following a Test-Driven Development (TDD) approach. It includes CRUD endpoints, validation, referential integrity check on delete, and case-insensitive uniqueness check on role name.

**1. Role Name Constraints & Validation:**
* Name must be a non-empty string.
* Minimum length: 2 characters.
* Maximum length: 100 characters.
* Must be trimmed of leading/trailing whitespace.
* **Case-Insensitive Uniqueness:** Names must be unique. E.g., if "Software Engineer" exists, creating "software engineer" or "SOFTWARE ENGINEER" must fail with a `ConflictException` (409 Conflict).

**2. Deleting a Role with Employees:**
* Prevent deletion if a role is linked to any active employee records (violating referential integrity). The service must throw a `ConflictException` (409 Conflict).

**3. Pagination on List Role Endpoint:**
* No pagination. The list of roles is reference data and is typically small (<100). We will return all roles ordered alphabetically by name.

## Open Questions

None. The design constraints and specifications align directly with the patterns established and approved in the Department module.

---

## Proposed Changes

### Role Module

#### [NEW] [create-role.dto.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/dto/create-role.dto.ts)
* DTO containing validation decorators (`@IsString`, `@IsNotEmpty`, `@MinLength`, `@MaxLength`) for role creation.

#### [NEW] [update-role.dto.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/dto/update-role.dto.ts)
* DTO containing validation decorators for role updates.

#### [NEW] [roles.service.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/roles.service.ts)
* Implements service business logic:
  * Trim incoming names.
  * In-memory case-insensitive uniqueness check (compatible with SQLite & PostgreSQL).
  * Referential integrity check on delete (validate `employee.count({ where: { roleId } })` is 0).

#### [NEW] [roles.service.spec.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/roles.service.spec.ts)
* Service unit tests running in isolation (mocking `PrismaService`):
  * **Create Role**: Successful trimmed creation, conflict error on duplicate names (case-insensitive).
  * **Read Roles**: Retrieval of all sorted alphabetically, retrieval by ID, not found error on invalid ID.
  * **Update Role**: Successful trimmed name update, not found error on invalid ID, conflict error on name clash with other role.
  * **Delete Role**: Successful deletion, not found error on invalid ID, conflict error on active employee association.

#### [NEW] [roles.controller.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/roles.controller.ts)
* REST controller mapping endpoints (`POST /roles`, `GET /roles`, `GET /roles/:id`, `PATCH /roles/:id`, `DELETE /roles/:id`).

#### [NEW] [roles.controller.spec.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/roles.controller.spec.ts)
* Controller unit tests verifying route handler invocation, status codes, and DTO validation rules.

#### [NEW] [roles.module.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/roles/roles.module.ts)
* Wire controllers and services under NestJS.

#### [MODIFY] [app.module.ts](file:///home/swapnil/Desktop/salary-management-app/backend/src/app.module.ts)
* Register `RolesModule` in the root NestJS module.

---

## Verification Plan

### Automated Tests
* Run unit tests:
  ```bash
  npm run test
  ```
* Run linter:
  ```bash
  npm run lint
  ```
* Build application:
  ```bash
  npm run build
  ```

### Manual Verification
* Verified dynamically through comprehensive Jest unit testing covering all routes and constraints.
