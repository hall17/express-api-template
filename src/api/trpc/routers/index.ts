import { trpc } from '@api/trpc';

import { authRouter } from './authRouter';
import { userRouter } from './userRouter';

export const appRouter = trpc.router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
