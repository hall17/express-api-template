import { Request } from 'express';
import { Container } from 'typedi';

import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';

export class UsersController {
  usersService = Container.get(UsersService);

  findOne = async (req: Request) => {
    const id = String(req.params.id);
    return this.usersService.findOne(id);
  };

  findAll = async (req: Request<unknown, unknown, unknown, GetUsersFilterDto>) => {
    return this.usersService.findAll(req.query);
  };

  create = async (req: Request<unknown, unknown, CreateUserDto>) => {
    return this.usersService.create(req.body);
  };

  update = async (req: Request<Record<string, string>, unknown, UpdateUserDto>) => {
    const id = String(req.params.id);
    return this.usersService.update(id, req.body);
  };

  delete = async (req: Request) => {
    const id = String(req.params.id);
    return this.usersService.delete(id);
  };
}
