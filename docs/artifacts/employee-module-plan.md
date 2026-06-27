# Implementation Plan — Employee Module (TDD)

This plan outlines the architecture, database schema updates, API endpoints, request/response contracts, validation constraints, and a comprehensive testing suite for the `Employee` module.

## Required Prisma Schema Updates

**1. Add `email` field to `Employee`**
* **Justification:** The current schema lacks contact information. An `email` field is standard for employee records and serves as an essential secondary unique identifier.

**2. Add a `Sequence` model**
* **Justification:** Relying on the highest existing ID can cause concurrency issues (race conditions) or full table scans in large datasets. A dedicated Sequence table allows atomic increments for robust and fast ID generation.
```prisma
model Sequence {
  name  String @id // e.g., "employeeId"
  value Int    @default(0)
}

model Employee {
  // ... existing fields
  email String @unique
  // ...
}
```

## Employee ID Generation Strategy
* **Format:** `EMP-XXXXX` (e.g., `EMP-00001`, `EMP-00042`, `EMP-99999`, `EMP-100000`).
* **Generation Logic:** At runtime during `POST /employees`, the system will transactionally fetch and increment the value in the `Sequence` table for `name = "employeeId"`. It will pad the retrieved value with leading zeros to at least 5 digits and append it to the `EMP-` prefix.

## Date Normalization Strategy
To strictly enforce the **"at most one salary rate per day"** rule and prevent time-based edge cases, all `effectiveDate` values will be normalized to UTC midnight (e.g., `YYYY-MM-DDT00:00:00.000Z`) at the application layer before any processing or persistence.

---

## Module Responsibilities
* **EmployeeController**: Handle HTTP requests, apply input validation using DTOs, and map responses.
* **EmployeeService**: Execute business logic (sequential ID generation, date normalization, transactional record creation, current salary calculation) and interact with Prisma.
* **EmployeeModule**: Aggregate the controller and service, and import necessary dependencies (PrismaModule).

---

## API Endpoints & Contracts

### 1. Create Employee
**`POST /employees`**
* **Request Body:**
  * `name`: string, min 2 chars, max 150 chars, trimmed.
  * `email`: string, valid email format.
  * `departmentId`: UUID string.
  * `roleId`: UUID string.
  * `countryId`: UUID string.
  * `salary`: number (positive decimal).
  * `effectiveDate`: (optional) ISO-8601 Date string. Defaults to current date normalized to UTC midnight. **Validation**: Cannot be a past date (must be `>= today`).
* **Response (201 Created):** Combined Employee and initial SalaryRecord object.
* **Error Handling:**
  * `400 Bad Request`: Validation failure (e.g., past effective date).
  * `404 Not Found`: If provided department, role, or country UUID doesn't exist.
  * `409 Conflict`: If `email` already exists.

### 2. Get Employees (Paginated & Filtered)
**`GET /employees`**
* **Query Parameters:**
  * `page`: integer (default 1).
  * `limit`: integer (default 10).
  * `search`: string (matches case-insensitive `name` or exact `employeeId` or exact `email`).
  * `departmentId`, `roleId`, `countryId`: optional UUID strings.
* **Response (200 OK):**
  * `data`: Array of employee objects, including their computed dynamic **current salary** (latest record where `effectiveDate <= now`).
  * `meta`: `{ total, page, limit, totalPages }`.

### 3. Get Single Employee
**`GET /employees/:id`**
* **Response (200 OK):** Detailed employee object with computed **current salary**.
* **Error Handling:** `404 Not Found` if ID does not exist.

### 4. Update Employee Profile
**`PATCH /employees/:id`**
* **Request Body:** Optional fields (`name`, `email`, `departmentId`, `roleId`, `countryId`).
* **Response (200 OK):** Updated employee object.
* **Error Handling:** `404 Not Found` (employee or relations invalid), `409 Conflict` (email taken by another).

### 5. Add Salary Record
**`POST /employees/:id/salaries`**
* **Request Body:**
  * `amount`: number (positive decimal).
  * `effectiveDate`: ISO-8601 Date string. **Validation**: Cannot be a past date (must be `>= today`).
* **Response (201 Created):** New SalaryRecord object.
* **Error Handling:**
  * `400 Bad Request`: Validation failure (e.g., past effective date) or if the new `amount` is equal to the employee's current active salary.
  * `404 Not Found`: Employee doesn't exist.
  * `409 Conflict`: A salary record already exists for this employee on the *exact same day* (normalized to UTC midnight).

### 6. Get Salary History
**`GET /employees/:id/salaries`**
* **Response (200 OK):** Array of all SalaryRecords sorted by `effectiveDate` descending.

### 7. Delete Employee
**`DELETE /employees/:id`**
* **Response (200 OK / 204 No Content):** Deletes employee and cascades to all salary records.

---

## Unit Testing Strategy

### A. EmployeeService Unit Tests (`employees.service.spec.ts`)

**Positive Scenarios:**
* **ID Generation - First Entry:** Successfully assigns `EMP-00001` when the Sequence table is queried for the first time, inserting the sequence record and creating the employee transactionally.
* **ID Generation - Incrementing:** Successfully increments a mocked Sequence value of `42` to `43` and assigns `EMP-00043`.
* **ID Generation - Rollover:** Successfully handles sequence overflow (e.g., from `99999` to `100000` mapping to `EMP-100000`).
* **Get All:** Retrieves paginated list, accurately calculating the current active salary (latest record where `effectiveDate <= now`).
* **Search & Filters:** Retrieves correct records when applying `search` and categorical filters.
* **Update Profile:** Updates basic information securely.
* **Add Salary:** Successfully adds a future-dated salary record without affecting current active salary.
* **Delete:** Cascades deletion smoothly.

**Negative Scenarios:**
* **Create - Invalid Relations:** Throws `NotFoundException` if `departmentId`, `roleId`, or `countryId` are absent in the database.
* **Create - Duplicate Email:** Throws `ConflictException` if email is already taken.
* **Update - Duplicate Email:** Throws `ConflictException` if updating email to one that belongs to another employee.
* **Update/Delete - Missing ID:** Throws `NotFoundException` for non-existent employee ID.
* **Add Salary - Duplicate Amount:** Throws `BadRequestException` (or `UnprocessableEntityException`) if the new salary amount matches the employee's current active salary.
* **Add Salary - Conflict:** Throws `ConflictException` if adding a salary record on an effective date that already has a record for that employee (preventing multiple rates per day).

**Edge Cases & Validation:**
* **Current Salary Calculation:** Employee has only future-dated salaries (current salary should evaluate to `null` or `0`).
* **Current Salary Calculation:** Employee has multiple past salaries; verifies the correct one (closest to `now`) is chosen.
* **Date Normalization:** Adding salaries with times like `23:59` and `00:01` on the same date correctly map to the same UTC midnight and trigger the `409 Conflict`.

### B. EmployeeController Unit Tests (`employees.controller.spec.ts`)

**Positive Scenarios:**
* Verifies all routes (`POST /employees`, `GET /employees`, etc.) correctly call their corresponding Service methods and return standard HTTP status codes (`201` for creations, `200` for reads/updates/deletes).

**Validation Scenarios (DTOs):**
* **CreateEmployeeDto:** Rejects requests with negative/zero salaries, invalid emails, empty strings, non-UUID foreign keys, malformed dates, or **past dates**. Rejects requests that attempt to pass `employeeId` explicitly in the body.
* **CreateSalaryRecordDto:** Rejects requests with negative/zero salaries, malformed dates, or **past dates**.
