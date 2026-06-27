# 1. Database Schema Design Prompt

Analyze the provided requirements document and design a normalized, scalable database schema that satisfies all stated functional requirements, business rules, and constraints.

## Instructions

* Read the requirements document thoroughly before designing the schema.
* Do **not** make assumptions or introduce features outside the documented scope.
* If any requirement is ambiguous or insufficient to make a sound design decision, ask clarifying questions before proceeding.
* Keep the schema simple, normalized, and aligned with the project scope while considering future extensibility where appropriate.
* Design with the stated performance constraint of **10,000+ employees** in mind.

## Deliverables

* Summarize the identified entities and their relationships.
* Explain the reasoning behind the database design.
* Recommend indexes and constraints where appropriate.
* Generate an ER diagram (Mermaid format).
* Generate a production-ready Prisma schema (`schema.prisma`).
* Highlight any assumptions made only after explicit clarification.





# 2. Department Module Implementation Plan (TDD)

## Objective

Analyze the project requirements, database schema, and existing codebase before proceeding with the implementation of the **Department** module.

The module will be developed using a **Test-Driven Development (TDD)** approach.

## Instructions

* Review the project requirements, database schema, and current project structure before proposing any solution.
* Do **not** write any implementation code at this stage.
* Do **not** make assumptions. If any requirement or design decision is ambiguous or missing, ask clarifying questions before proceeding.
* Keep the proposed solution aligned with the project scope and existing architecture.

## Deliverables

Prepare a detailed implementation plan that includes:

* Module responsibilities
* API endpoints
* Request and response contracts
* Validation rules
* Dependencies and interactions with other modules
* Error handling strategy
* Edge cases
* Recommended project structure (if applicable)

## Unit Testing Strategy

Create a comprehensive unit testing plan that:

* Covers the core functionality of the module
* Produces tests that are fast, deterministic, and easy to understand
* Promotes good code structure, readability, and maintainability
* Identifies positive, negative, validation, and edge-case scenarios
* Recommends the order in which the tests should be implemented following TDD

## Review Process

Present the implementation plan and proposed unit test suite for review and feedback.

Wait for approval before generating any tests or implementation code.

After the plan has been reviewed and approved, proceed iteratively by:

1. Writing the unit tests first.
2. Reviewing the tests.
3. Implementing the minimum code required to satisfy the tests.
4. Refactoring where appropriate while ensuring all tests continue to pass.



# 3. Role Module Implementation Plan (TDD)

## Objective

Analyze the project requirements, database schema, and existing codebase before proceeding with the implementation of the **Role** module.

The module will be developed using a **Test-Driven Development (TDD)** approach.

## Instructions

* Review the project requirements, database schema, and current project structure before proposing any solution.
* Do **not** write any implementation code at this stage.
* Do **not** make assumptions. If any requirement or design decision is ambiguous or missing, ask clarifying questions before proceeding.
* Keep the proposed solution aligned with the project scope and existing architecture.

## Deliverables

Prepare a detailed implementation plan that includes:

* Module responsibilities
* API endpoints
* Request and response contracts
* Validation rules
* Dependencies and interactions with other modules
* Error handling strategy
* Edge cases
* Recommended project structure (if applicable)

## Unit Testing Strategy

Create a comprehensive unit testing plan that:

* Covers the core functionality of the module
* Produces tests that are fast, deterministic, and easy to understand
* Promotes good code structure, readability, and maintainability
* Identifies positive, negative, validation, and edge-case scenarios
* Recommends the order in which the tests should be implemented following TDD

## Review Process

Present the implementation plan and proposed unit test suite for review and feedback.

Wait for approval before generating any tests or implementation code.

After the plan has been reviewed and approved, proceed iteratively by:

1. Writing the unit tests first.
2. Reviewing the tests.
3. Implementing the minimum code required to satisfy the tests.
4. Refactoring where appropriate while ensuring all tests continue to pass.


# 4. Country Module Implementation Plan

## Objective

Analyze the project requirements, database schema, and existing codebase before proceeding with the implementation of the **Country** module.

Countries are treated as **reference (master) data** and should not have CRUD operations.

## Instructions

* Review the project requirements, database schema, and current project structure before proposing a solution.
* Do **not** write any implementation code at this stage.
* Do **not** make assumptions. If any requirement or design decision is ambiguous or missing, ask clarifying questions before proceeding.
* Follow NestJS and Prisma best practices.

## Deliverables

Prepare an implementation plan that includes:

* A lightweight read-only Country module.
* An idempotent seeding strategy for an initial set of 5–6 countries.
* A seeding approach that avoids duplicates, preserves existing records, and inserts only newly added countries on subsequent runs.
* A simple `GET /countries` API for frontend dropdowns.
* The recommended project structure and Prisma seeding approach.
* Any required package scripts or configuration updates.

## Review Process

Present the implementation plan for review and feedback.

Wait for approval before generating any implementation code.


# 5. Employee Module Implementation Plan (TDD)

Analyze the project requirements, database schema, and existing codebase before proceeding. We will implement the **Employee** module using a **Test-Driven Development (TDD)** approach.

## Instructions

* Do **not** generate any implementation code yet.
* Review the requirements, database schema, and current architecture before proposing a solution.
* If the existing Prisma schema requires changes (e.g., adding missing employee fields such as **email**), identify and justify those changes before implementation.
* The `Employee` entity should include essential employee information such as **email**, and the **employeeId** should be generated **sequentially** using a predefined format (to be proposed and agreed upon during the planning phase).
* Do **not** make assumptions. If any requirement or design decision is ambiguous, ask clarifying questions before proceeding.

## Deliverables

Prepare a detailed implementation plan covering:

* Module responsibilities
* Required Prisma schema updates (if any)
* API endpoints
* Request and response contracts
* Validation rules
* Employee ID generation strategy and format
* Dependencies and interactions with other modules
* Error handling strategy
* Edge cases

## Unit Testing Strategy

Provide a comprehensive list of **all unit test cases**, including:

* Positive scenarios
* Negative scenarios
* Validation scenarios
* Edge cases

Ensure the proposed tests are **fast, deterministic, maintainable, and cover the core functionality**.

## Review Process

Present the implementation plan and complete test suite for review and feedback.

**Do not generate any tests or implementation code until the plan and test cases have been reviewed, finalized, and approved.**

After approval:

1. Write the unit tests first.
2. Review the tests.
3. Implement the minimum code required to satisfy the tests.
4. Refactor while ensuring all tests continue to pass.