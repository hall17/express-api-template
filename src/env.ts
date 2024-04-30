import { createEnv } from '@t3-oss/env-core';
import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const env = createEnv({
  server: {
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    PORT: z.string().min(1).transform(Number),
    DATABASE_URL: z.string().min(1),
    ACCESS_TOKEN_SECRET_KEY: z.string().min(1),
    LOG_FORMAT: z.string().min(1),
    // LOG_FORMAT: z.union([
    //   z.literal('combined'),
    //   z.literal('common'),
    //   z.literal('dev'),
    //   z.literal('short'),
    //   z.literal('tiny'),
    // ]),
    ORIGIN: z
      .string()
      .min(1)
      .transform((origin) => JSON.parse(origin)),
    CREDENTIALS: z.string().min(1).transform(Boolean),
    BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});

console.log({ env });
