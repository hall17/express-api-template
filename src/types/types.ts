import { Router } from 'express';
import { z } from 'zod';

export type Routes = {
  path?: string;
  router: Router;
};

export type User = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export type TokenData = {
  token: string;
  expiresIn: number;
};

export const DefaultFilterSchema = z.strictObject({
  q: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().transform(Number).optional(),
  size: z.string().transform(Number).optional(),
});
