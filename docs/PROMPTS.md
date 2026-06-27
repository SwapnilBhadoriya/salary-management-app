# Database Schema Design Prompt

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
