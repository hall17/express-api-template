import { Request } from 'express';
import { Container } from 'typedi';

import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

export class UserController {
  userService = Container.get(UserService);

  findOne = async (req: Request) => {
    const id = String(req.params.id);
    return this.userService.findOne(id);
  };

  findAll = async (req: Request<unknown, unknown, unknown, GetUsersFilterDto>) => {
    return this.userService.findAll(req.query);
  };

  create = async (req: Request<unknown, unknown, CreateUserDto>) => {
    return this.userService.create(req.body);
  };

  update = async (req: Request<Record<string, string>, unknown, UpdateUserDto>) => {
    const id = String(req.params.id);
    return this.userService.update(id, req.body);
  };

  delete = async (req: Request) => {
    const id = String(req.params.id);
    return this.userService.delete(id);
  };
}
