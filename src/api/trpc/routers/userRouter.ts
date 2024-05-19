import { UserSchemas } from '@api/api/user/user.dto';
import { UserService } from '@api/api/user/user.service';
import { protectedProcedure, trpc } from '@api/trpc';
import Container from 'typedi';
import { z } from 'zod';

const userService = Container.get(UserService);

export const userRouter = trpc.router({
  findOne: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return userService.findOne(input);
  }),
  findAll: protectedProcedure.input(UserSchemas.getFilterSchema).query(async ({ input }) => {
    return userService.findAll(input);
  }),
  create: protectedProcedure.input(UserSchemas.createSchema).mutation(async ({ input }) => {
    return userService.create(input);
  }),
  update: protectedProcedure.input(UserSchemas.updateSchema).mutation(async ({ input }) => {
    return userService.update(input.id, input);
  }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return userService.delete(input);
  }),
});
