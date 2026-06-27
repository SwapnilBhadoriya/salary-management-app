# TDD Implementation Plan — Department Module

We will implement the `Department` module using a Test-Driven Development (TDD) approach. First, we define the module's responsibilities, API endpoints, validation rules, dependencies, and testing strategy.

---

**1. Scope of Department CRUD:**
Does the Department module require full CRUD (Create, Read, Update, Delete) capability?
* **Propose:** Yes, full CRUD. 
*   * `POST /departments` (Create)
*   * `GET /departments` (List all, ordered alphabetically)
*   * `GET /departments/:id` (Get details by ID)
*   * `PATCH /departments/:id` (Update department name)
*   * `DELETE /departments/:id` (Delete department)

**2. Deleting a Department with Employees:**
If a department contains employees, what should happen on deletion?
* **Propose:** Prevent deletion. If a department is linked to any employee records (violating referential integrity), the service must throw a `ConflictException` (409 Conflict) preventing the deletion.

**3. Department Name Constraints & Validation:**
What are the validation rules for a department name?
* **Propose:**
*   * Name must be a non-empty string.
*   * Minimum length: 2 characters.
*   * Maximum length: 100 characters.
*   * Must be trimmed of leading/trailing whitespace.
*   * **Case-Insensitive Uniqueness:** Names must be unique. E.g., if "Engineering" exists, creating "engineering" or "ENGINEERING" must fail with a `ConflictException` (409 Conflict).

**4. Pagination on List Department Endpoint:**
Do we need pagination for `/departments`?
* **Propose:** No. The list of departments is reference data and is typically small (<100). We will return all departments ordered alphabetically by name.

---

## Proposed Module Responsibilities

The Department module will be comprised of:
1. **`DepartmentController`**: Expose REST endpoints, validate incoming request bodies (DTOs), and map controller actions to service methods.
2. **`DepartmentService`**: Encapsulate the business logic, enforce constraints (uniqueness checks, referential integrity), and interact with Prisma.
3. **`CreateDepartmentDto` / `UpdateDepartmentDto`**: Validation schemas using `class-validator` and `class-transformer`.
4. **`PrismaService`**: Dependency for database access.

---

## Proposed API Endpoints & Validation Rules

### 1. `POST /departments`
* **Body:** `{ name: string }`
* **Validation:**
  * `name` must be a string, not empty, min length 2, max length 100.
* **Success Response:** `201 Created` with the created department object.
* **Errors:**
  * `400 Bad Request` if payload validation fails.
  * `409 Conflict` if the department name already exists (case-insensitive).

### 2. `GET /departments`
* **Success Response:** `200 OK` with an array of department objects, sorted alphabetically by name.

### 3. `GET /departments/:id`
* **Success Response:** `200 OK` with the department object.
* **Errors:**
  * `404 Not Found` if the department ID does not exist.

### 4. `PATCH /departments/:id`
* **Body:** `{ name: string }`
* **Validation:** Same as `POST`.
* **Success Response:** `200 OK` with the updated department object.
* **Errors:**
  * `400 Bad Request` if validation fails.
  * `404 Not Found` if department ID does not exist.
  * `409 Conflict` if the new name is already taken by another department.

### 5. `DELETE /departments/:id`
* **Success Response:** `200 OK` or `204 No Content`.
* **Errors:**
  * `404 Not Found` if department ID does not exist.
  * `409 Conflict` if the department cannot be deleted because it still contains active employees.

---

## Unit Testing Strategy

To ensure fast, deterministic, and isolated unit tests, we will mock the Prisma Client using Jest.

### Mocking Strategy
We will mock the `PrismaService` using Jest's mocking utilities. We will mock the `department` and `employee` delegates to return pre-defined data, mock exceptions, or count queries.

### Test Files to Create
1. `src/departments/departments.service.spec.ts` (Service unit tests)
2. `src/departments/departments.controller.spec.ts` (Controller unit tests)

### Recommended Order of Writing Tests (TDD Cycle)

We will write and pass service tests first (core business logic), followed by controller tests:

1. **`DepartmentService` - Create Department**
   * Test 1: Should successfully create a department with a valid trimmed name.
   * Test 2: Should throw `ConflictException` if the department name already exists (case-insensitive).
2. **`DepartmentService` - Read Departments**
   * Test 3: Should retrieve all departments sorted alphabetically.
   * Test 4: Should retrieve a single department by ID.
   * Test 5: Should throw `NotFoundException` if the department is not found by ID.
3. **`DepartmentService` - Update Department**
   * Test 6: Should successfully update the name of an existing department.
   * Test 7: Should throw `NotFoundException` when trying to update a non-existent department.
   * Test 8: Should throw `ConflictException` when renaming a department to a name already taken by another department.
4. **`DepartmentService` - Delete Department**
   * Test 9: Should successfully delete a department that has no employees.
   * Test 10: Should throw `NotFoundException` when deleting a non-existent department.
   * Test 11: Should throw `ConflictException` if the department has associated employees.
5. **`DepartmentController` - Action Mapping & HTTP Codes**
   * Test 12: Validate endpoint mapping and matching HTTP status codes.
   * Test 13: Validate input validation (using manual trigger of `ValidationPipe` on mock payloads).
