import { PrismaClient } from '@prisma/client';
import { parse } from 'pg-connection-string';

import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function seed() {
  const parsedDatabaseUrl = parse(process.env.DATABASE_URL as string);

  if (parsedDatabaseUrl.host !== 'localhost') {
    throw new Error('Invalid DATABASE_URL provided. Please provide a local database url.');
  }

  console.log(`DATABASE_URL="${process.env.DATABASE_URL}"`);

  // reset database
  const databaseResetCommand = 'yarn run prisma migrate reset -f';
  console.log(`Resetting database (command: "${databaseResetCommand}").`);
  execSync(databaseResetCommand, { stdio: 'inherit' });

  // seed database

  console.log('Database initialized successfully.');
  process.exit();
}

if (process.env.NODE_ENV === 'development') {
  seed()
    // loadFromExcel(companies.wiserSense, wiserSenseUsers)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
