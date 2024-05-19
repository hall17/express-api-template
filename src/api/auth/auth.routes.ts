import { Routes } from '@api/common/interfaces';
import { authenticate, response, validate } from '@api/middlewares';
import { Router } from 'express';

import { AuthController } from './auth.controller';
import { AuthSchemas } from './auth.dto';

export class AuthRoutes implements Routes {
  path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validate(AuthSchemas.loginSchema), response(this.authController.login));
    this.router.post(`${this.path}/verify`, authenticate, response(this.authController.verify));
    this.router.post(`${this.path}/logout`, authenticate, response(this.authController.logout));
  }
}
