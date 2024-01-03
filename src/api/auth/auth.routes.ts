import { Router } from 'express';

import { authenticate, response, validate } from '@/middlewares';

import { AuthController } from './auth.controller';
import { LoginUserSchema } from './dtos/login-user-dto';

import { Routes } from '@/types/routes.interface';

export class AuthRoutes implements Routes {
  path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validate(LoginUserSchema), response(this.authController.login));
    this.router.post(`${this.path}/verify`, authenticate, response(this.authController.verify));
    this.router.post(`${this.path}/logout`, authenticate, response(this.authController.logout));
  }
}
