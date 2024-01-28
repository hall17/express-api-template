import { z } from 'zod';

import { HttpStatus } from '../enums';

export type User = {
  id: string;
  email: string;
  companyId: number;
  positionId: string;
  titleId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
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

export type HttpExceptionType = { status: HttpStatus; message: string };
