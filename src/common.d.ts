import { User } from './common/types';

declare global {
  namespace Express {
    interface Request {
      user: User;
      // define your own types here
    }
  }
}
