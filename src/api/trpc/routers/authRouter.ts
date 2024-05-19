import { LoginUserSchema, ProxyLoginUserSchema, ResetPasswordSchema } from '@api/api/auth/auth.dto';
import { AuthService } from '@api/api/auth/auth.service';
import { protectedProcedure, publicProcedure, trpc } from '@api/api/trpc';
import { authenticateAdminTRPC, authenticateTokenTRPC } from '@api/api/trpc/middlewares';
import { TokenType } from '@prisma/client';
import Container from 'typedi';

const authService = Container.get(AuthService);

export const authRouter = trpc.router({
  login: publicProcedure.input(LoginUserSchema).mutation(async ({ ctx: { res }, input }) => {
    const { cookie, user } = await authService.login(input);
    res.setHeader('Set-Cookie', [cookie]);
    return user;
  }),
  logout: protectedProcedure.mutation(async ({ ctx: { req, res } }) => {
    const user = await authService.logout(req.user);

    res.setHeader('Set-Cookie', ['Authorization=; Path=/; Max-age=0;']);
    return user;
  }),
  proxyLogin: publicProcedure
    .use(authenticateAdminTRPC)
    .input(ProxyLoginUserSchema)
    .mutation(async ({ ctx: { req, res }, input }) => {
      const { cookie, user } = await authService.proxyLogin(req.user, input);
      res.setHeader('Set-Cookie', [cookie]);

      return user;
    }),
  proxyLogout: publicProcedure.use(authenticateAdminTRPC).mutation(async ({ ctx: { req, res } }) => {
    const { cookie, user } = await authService.proxyLogout(req.user);

    res.setHeader('Set-Cookie', [cookie]);
    return user;
  }),
  verify: protectedProcedure.mutation(async ({ ctx: { req } }) => {
    return authService.verify(req.user);
  }),
  verifyToken: publicProcedure.use(authenticateTokenTRPC({ query: true })).mutation(async ({ ctx: { req } }) => {
    return authService.verifyToken(req.user, req.query.type as TokenType);
  }),
  resetPassword: publicProcedure
    .use(authenticateTokenTRPC({ body: true }))
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx: { req, res }, input }) => {
      const { cookie, user } = await authService.resetPassword(req.user, input);

      res.setHeader('Set-Cookie', [cookie]);

      return user;
    }),
  createPassword: publicProcedure
    .use(authenticateTokenTRPC({ body: true }))
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx: { req, res }, input }) => {
      const { cookie, user } = await authService.resetPassword(req.user, input);

      res.setHeader('Set-Cookie', [cookie]);

      return user;
    }),
});
