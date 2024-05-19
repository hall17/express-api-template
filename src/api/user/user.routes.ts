import { Routes } from '@api/common/interfaces';
import { authenticate, response, validate } from '@api/middlewares';
import { Router } from 'express';

import { UserController } from './user.controller';
import { UserSchemas } from './user.dto';

export class UserRoutes implements Routes {
  path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authenticate, response(this.userController.findOne));
    this.router.get(
      `${this.path}`,
      authenticate,
      validate(UserSchemas.getFilterSchema, { query: true }),
      response(this.userController.findAll),
    );
    this.router.post(
      `${this.path}`,
      authenticate,
      validate(UserSchemas.createSchema),
      response(this.userController.create),
    );
    this.router.patch(
      `${this.path}/:id`,
      authenticate,
      validate(UserSchemas.updateSchema),
      response(this.userController.update),
    );
    this.router.delete(`${this.path}/:id`, authenticate, response(this.userController.delete));
  }
}
