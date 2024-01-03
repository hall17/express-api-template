import { User } from './types/types';

declare global {
  namespace Express {
    interface Request {
      user: User;
      // define your own types here
    }
  }
}
