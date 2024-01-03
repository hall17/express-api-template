import { cleanEnv, port, str } from 'envalid';

export const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    ACCESS_TOKEN_SECRET_KEY: str(),
    ORIGIN: str(),
  });
};
