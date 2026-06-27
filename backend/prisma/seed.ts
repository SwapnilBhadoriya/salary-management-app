import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

const countries = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'India', code: 'IN' },
  { name: 'Canada', code: 'CA' },
  { name: 'Germany', code: 'DE' },
  { name: 'Australia', code: 'AU' },
];

async function main() {
  console.log('Seeding countries...');
  for (const country of countries) {
    const existing = await prisma.country.findUnique({
      where: { code: country.code },
    });
    if (!existing) {
      await prisma.country.create({
        data: country,
      });
      console.log(`Created country: ${country.name} (${country.code})`);
    } else {
      console.log(`Country already exists, skipping: ${country.name} (${country.code})`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seeding completed successfully.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
