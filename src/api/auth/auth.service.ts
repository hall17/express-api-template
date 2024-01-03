import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

import { ACCESS_TOKEN_SECRET_KEY } from '@/config';
import { httpExceptions } from '@/utils';

import { LoginUserDto } from './dtos/login-user-dto';

import { prisma } from '@/libs/prisma';
import { HttpException } from '@/types/HttpException';
import { TokenData } from '@/types/types';

@Service()
export class AuthService {
  // public async signup(userData: CreateUserDto): Promise<User> {
  //   const findUser: User = await prisma.user.findUnique({ where: { email: userData.email } });

  //   if (findUser) {
  //     throw new HttpException(409, `This email ${userData.email} already exists`);
  //   }

  //   const hashedPassword = await hash(userData.password, 10);
  //   const createUserData: Promise<User> = await prisma.user.create({ data: { ...userData, password: hashedPassword } });

  //   return createUserData;
  // }

  public async login(dto: LoginUserDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException(httpExceptions.accountNotFound);
    }

    const isPasswordMatching = await compare(dto.password, user.password);

    if (!isPasswordMatching) {
      throw new HttpException(httpExceptions.wrongPassword);
    }

    const tokenData = this.createToken(user.id, user.email, user.userRole === 'ADMIN');
    const cookie = this.createCookie(tokenData);

    return {
      cookie,
      user,
    };
  }

  public async verify(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(httpExceptions.userNotFound);
    }

    return user;
  }

  public async logout(dto: LoginUserDto) {
    const user = await prisma.user.findFirst({
      where: { email: dto.email, password: dto.password },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new HttpException(httpExceptions.accountNotFound);
    }

    return user;
  }

  public createToken(userId: string, email: string, isAdmin: boolean): TokenData {
    const expiresIn: number = 60 * 60 * 6;

    return { expiresIn, token: sign({ id: userId, email, isAdmin }, ACCESS_TOKEN_SECRET_KEY as string, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; Path=/; Max-Age=${tokenData.expiresIn}; HttpOnly; SameSite=None; Secure;`;
  }
}
