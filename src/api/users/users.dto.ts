import { Gender, UserRole, UserStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { z } from 'zod';

import { DefaultFilterSchema } from '@/common/types';

export const CreateUserSchema = z.strictObject({
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
  languageId: z.number().int().positive().optional(),
  userSettings: z
    .string()
    .refine((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (_) {
        return false;
      }
    })
    .optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const GetUsersFilterSchema = z
  .strictObject({
    gender: z.nativeEnum(Gender).optional(),
    status: z.array(z.nativeEnum(UserStatus)).optional(),
    groupId: z.string().transform(Number).optional(),
    departmentId: z.string().transform(Number).optional(),
    unitId: z.string().transform(Number).optional(),
    positionId: z.string().transform(Number).optional(),
    titleId: z.string().transform(Number).optional(),
    availableForEvaluationPeriodId: z.string().transform(Number).optional(),
    availableForEvaluateePeerEvaluationPeriodId: z.string().transform(Number).optional(),
    includeUserIds: z.array(z.string().uuid()).optional(),
  })
  .merge(DefaultFilterSchema);

export type GetUsersFilterDto = z.output<typeof GetUsersFilterSchema>;
