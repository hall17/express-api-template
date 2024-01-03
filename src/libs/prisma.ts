/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';

export let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
    // global.prisma = new PrismaClient({
    //   log: [
    //     {
    //       emit: 'event',
    //       level: 'query',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'error',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'info',
    //     },
    //     {
    //       emit: 'stdout',
    //       level: 'warn',
    //     },
    //   ],
    // });
    // global.prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
    //   console.log('Query: ' + e.query);
    //   console.log('Params: ' + e.params);
    //   console.log('Duration: ' + e.duration + 'ms');
    // });
  }
  // @ts-ignore
  prisma = global.prisma;
}
