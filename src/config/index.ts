import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const ORIGIN = process.env.ORIGIN?.split(',');
export const { NODE_ENV, PORT, ACCESS_TOKEN_SECRET_KEY, LOG_FORMAT, LOG_DIR } = process.env;
