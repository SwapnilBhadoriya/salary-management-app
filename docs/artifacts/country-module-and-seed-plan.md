# Implementation Plan — Country Module & Idempotent Seeding

Design a lightweight `Country` module where countries are treated as read-only reference data. Instead of full CRUD, the module features a simple read-only API and a custom seeding strategy that populates default country records.

## User Review Required

> [!IMPORTANT]
> **1. Initial Reference Countries list:**
> We propose seeding the following 6 standard countries:
> * **United States** (US)
> * **United Kingdom** (GB)
> * **India** (IN)
> * **Canada** (CA)
> * **Germany** (DE)
> * **Australia** (AU)
>
> **2. Idempotent Seeding Strategy:**
> To ensure subsequent seed runs do not modify or override any modified attributes of existing records (such as custom IDs or names changed directly in DB), the seed script will search for each country by its unique country `code`.
> * If a country with the unique `code` is found, the script does nothing (avoids updating).
> * If not found, it inserts the new country record.
>
> **3. API Endpoint:**
> * `GET /countries` - Returns all seeded countries sorted alphabetically by name.
> * No other REST actions (`POST`, `PATCH`, `DELETE`) will be exposed since countries are strictly read-only reference data.

---

## Proposed Changes

### 1. Database Seeding

#### [NEW] [seed.ts](/backend/prisma/seed.ts)
* Implements the idempotent seeding logic:
  ```typescript
  import { PrismaClient } from '../src/generated/prisma'; // relative to seed file location
  
  const prisma = new PrismaClient();
  
  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'India', code: 'IN' },
    { name: 'Canada', code: 'CA' },
    { name: 'Germany', code: 'DE' },
    { name: 'Australia', code: 'AU' },
  ];
  
  async function main() {
    for (const country of countries) {
      const existing = await prisma.country.findUnique({
        where: { code: country.code },
      });
      if (!existing) {
        await prisma.country.create({
          data: country,
        });
      }
    }
  }
  ```
* Register seed command in `backend/package.json`:
  ```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
  ```

### 2. Country Module

#### [NEW] [countries.service.ts](/backend/src/countries/countries.service.ts)
* `findAll()`: Returns all countries alphabetically sorted: `prisma.country.findMany({ orderBy: { name: 'asc' } })`.

#### [NEW] [countries.service.spec.ts](/backend/src/countries/countries.service.spec.ts)
* Unit tests for `CountryService.findAll()`.

#### [NEW] [countries.controller.ts](/backend/src/countries/countries.controller.ts)
* Exposes `GET /countries` mapping to `CountryService.findAll()`.

#### [NEW] [countries.controller.spec.ts](/backend/src/countries/countries.controller.spec.ts)
* Unit tests for `CountryController.findAll()`.

#### [NEW] [countries.module.ts](/backend/src/countries/countries.module.ts)
* Wires up the module components.

#### [MODIFY] [app.module.ts](/backend/src/app.module.ts)
* Register `CountriesModule` in NestJS imports.

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
* Run seeding:
  ```bash
  npx prisma db seed
  ```
* Verify database contents:
  Validate that the 6 countries exist in the database, and running `npx prisma db seed` repeatedly does not generate duplicate records or raise constraints errors.
