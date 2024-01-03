import { Request, Response } from 'express';
import { Container } from 'typedi';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user-dto';

export class AuthController {
  authService = Container.get(AuthService);

  login = async (req: Request, res: Response) => {
    const userData = req.body as LoginUserDto;
    const { cookie, user } = await this.authService.login(userData);

    res.setHeader('Set-Cookie', [cookie]);
    // res.cookie('Authorization', cookie, { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
    return user;
  };

  verify = (req: Request) => {
    return this.authService.verify(req.user.id);
  };

  logout = async (req: Request, res: Response) => {
    const userData = req.body as LoginUserDto;
    const user = await this.authService.logout(userData);

    res.setHeader('Set-Cookie', ['Authorization=; Path=/; Max-age=0;']);
    return user;
  };
}
