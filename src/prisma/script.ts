import { PrismaClient } from '@prisma/client';
import pLimit from 'p-limit';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const limit = pLimit(10);

const prisma = new PrismaClient();

async function script() {
  // run your script here
  console.log('Running script...');
}

script()
  .then(() => {
    console.log('Running script finished.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
