import { DefaultFilterSchema, IdSchema } from '@api/common/types';
import { Gender, UserRole, UserStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

export class UserSchemas {
  static createSchema = z.strictObject({
    id: z.string().optional(),
    userId: z.number().int().positive(),
    userRole: z.nativeEnum(UserRole).default(UserRole.USER),
    email: z.string().email().max(64),
    password: z.string().min(8).max(16),
    phone: z.string().min(10).max(16).optional(),
    firstName: z.string().min(3).max(64),
    lastName: z.string().min(3).max(64),
    isActive: z.boolean().optional(),
    hireDate: z
      .string()
      .transform((date) => new Date(dayjs(date).toISOString()))
      .optional(),
    terminationDate: z
      .string()
      .transform((date) => new Date(dayjs(date).toISOString()))
      .optional(),
    birthDate: z
      .string()
      .transform((date) => new Date(dayjs(date).toISOString()))
      .optional(),
    gender: z.nativeEnum(Gender).optional(),
    groupId: z.number().int().positive(),
    departmentId: z.number().int().positive().optional(),
    unitId: z.number().int().positive().optional(),
    positionId: z.number().int().positive(),
    titleId: z.number().int().positive().optional(),
    managerId: z.string().uuid().optional(),
  });
  static updateSchema = UserSchemas.createSchema.partial().merge(IdSchema);
  static getFilterSchema = z
    .strictObject({ status: z.array(z.nativeEnum(UserStatus)).optional() })
    .merge(DefaultFilterSchema);
}

export type CreateUserDto = z.infer<typeof UserSchemas.createSchema>;
export type UpdateUserDto = z.infer<typeof UserSchemas.updateSchema>;
export type GetUsersFilterDto = z.infer<typeof UserSchemas.getFilterSchema>;
