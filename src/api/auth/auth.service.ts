import { HTTP_EXCEPTIONS } from '@api/common/constants';
import { HttpException, TokenData } from '@api/common/types';
import { ACCESS_TOKEN_SECRET_KEY } from '@api/config';
import { prisma } from '@api/libs/prisma';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';

import { LoginUserDto } from './auth.dto';

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
      throw new HttpException(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
    }

    const isPasswordMatching = await compare(dto.password, user.password);

    if (!isPasswordMatching) {
      throw new HttpException(HTTP_EXCEPTIONS.WRONG_PASSWORD);
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
      throw new HttpException(HTTP_EXCEPTIONS.USER_NOT_FOUND);
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
      throw new HttpException(HTTP_EXCEPTIONS.ACCOUNT_NOT_FOUND);
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
