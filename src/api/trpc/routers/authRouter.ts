import { AuthSchemas } from '@api/api/auth/auth.dto';
import { AuthService } from '@api/api/auth/auth.service';
import { protectedProcedure, publicProcedure, trpc } from '@api/trpc';
import Container from 'typedi';

const authService = Container.get(AuthService);

export const authRouter = trpc.router({
  login: publicProcedure.input(AuthSchemas.loginSchema).mutation(async ({ ctx: { res }, input }) => {
    const { cookie, user } = await authService.login(input);
    res.setHeader('Set-Cookie', [cookie]);
    return user;
  }),
  logout: protectedProcedure.mutation(async ({ ctx: { req, res } }) => {
    const user = await authService.logout(req.user);

    res.setHeader('Set-Cookie', ['Authorization=; Path=/; Max-age=0;']);
    return user;
  }),
  verify: protectedProcedure.mutation(async ({ ctx: { req } }) => {
    return authService.verify(req.user);
  }),
});
