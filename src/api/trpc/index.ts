import { initTRPC, MiddlewareFunction, ProcedureParams } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
// import superjson from 'superjson';

import { authenticateTRPC } from './middlewares';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  return { req: { ...req, body: req.body[0] }, res };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

export const trpc = initTRPC.context<Context>().create({
  // transformer: superjson,
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(authenticateTRPC);

export type BaseMiddlewareFunction<$ContextIn> = MiddlewareFunction<
  { _ctx_out: $ContextIn } & ProcedureParams,
  ProcedureParams
>;
