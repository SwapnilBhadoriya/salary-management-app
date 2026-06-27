# Requirements Document - ACME Salary Management System

## Goal

Replace the HR team's Excel-based salary management workflow with a web application that supports **10,000+ employees**. The application should provide fast access to employee compensation data while maintaining a complete audit trail of salary changes.

## User Persona

**HR Manager** at ACME — a non-technical user who needs to efficiently search, update, and analyze employee salary data.

## Functional Requirements

The application should allow HR managers to:

* View a paginated list of employees with their monthly salary.
* Search employees by **name** or **employee ID**.
* Filter employees by **department**, **role**, and **country**.
* Add a new employee with compensation details.
* Update an employee's monthly salary by specifying an **effective date**.
* View the complete salary history for an employee.
* View basic analytics including:

  * Average monthly salary by department
  * Average monthly salary by country
  * Monthly salary band distribution
* Export the currently filtered employee list to CSV.

## Business Rules

* Every employee must have a unique Employee ID.
* Salary represents the employee's **monthly base salary**.
* All salaries are stored in a **single standard currency (USD)**.
* Salary updates must preserve previous values as historical records.
* The current salary always reflects the latest effective salary.

## Constraints

* Support datasets of **10,000+ employees**.
* Maintain a complete audit history of salary changes.
* Prioritize fast search, filtering, and reporting performance.

## Out of Scope

The following features are intentionally excluded:

* Authentication and authorization
* Payroll processing and payslip generation
* Benefits and equity management
* Approval workflows
* Real-time notifications
* Multi-currency support and currency conversion
* Multi-tenancy

These are acknowledged as considerations but are outside the scope of this project.
