import { Router } from 'express';

import { authenticate, response, validate } from '@/middlewares';

import { UsersController } from './users.controller';
import { CreateUserSchema, GetUsersFilterSchema, UpdateUserSchema } from './users.dto';

import { Routes } from '@/common/interfaces';

export class UsersRoutes implements Routes {
  path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, authenticate, response(this.usersController.findOne));
    this.router.get(
      `${this.path}`,
      authenticate,
      validate(GetUsersFilterSchema, { query: true }),
      response(this.usersController.findAll),
    );
    this.router.post(`${this.path}`, authenticate, validate(CreateUserSchema), response(this.usersController.create));
    this.router.patch(
      `${this.path}/:id`,
      authenticate,
      validate(UpdateUserSchema),
      response(this.usersController.update),
    );
    this.router.delete(`${this.path}/:id`, authenticate, response(this.usersController.delete));
  }
}
