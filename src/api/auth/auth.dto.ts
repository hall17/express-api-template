import { z } from 'zod';

export class AuthSchemas {
  static loginSchema = z.strictObject({
    email: z.string().email(),
    password: z.string().min(4).max(32),
  });
}

export type LoginUserDto = z.infer<typeof AuthSchemas.loginSchema>;
