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
