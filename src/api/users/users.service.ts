import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';

import { CreateUserDto, GetUsersFilterDto, UpdateUserDto } from './users.dto';

import { HTTP_EXCEPTIONS } from '@/common/constants';
import { HttpException } from '@/common/types';
import { prisma } from '@/libs/prisma';
import { PAGE_SIZE } from '@/utils/constants';

@Service()
export class UsersService {
  async findAll(filterDto: GetUsersFilterDto) {
    const {
      q,
      sort = `${Prisma.UserScalarFieldEnum.updatedAt}:${Prisma.SortOrder.desc}`,
      size = PAGE_SIZE,
    } = filterDto;

    const page = (filterDto.page || 0) + 1;
    // TODO: add type Prisma.Enumerable<Prisma.UserOrderByWithAggregationInput>
    const orderBy = {} as any;
    let where: Prisma.UserWhereInput = {};

    if (!!q) {
      where = {
        OR: [
          { email: q ? { contains: q, mode: 'insensitive' } : undefined },
          { firstName: q ? { contains: q, mode: 'insensitive' } : undefined },
          { lastName: q ? { contains: q, mode: 'insensitive' } : undefined },
        ],
        status: {
          in: filterDto.status || undefined,
        },
      };
    }

    if (sort) {
      const [sortBy, sortDirection = Prisma.SortOrder.desc] = sort.split(':');
      orderBy[sortBy] = sortDirection;
    }

    const [users, count] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * size,
        take: size,
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      count,
    };
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            userId: dto.userId,
          },
        ],
      },
    });

    if (users.length) {
      const emailExists = users.some((user) => user.email === dto.email);

      throw new HttpException(
        emailExists
          ? HTTP_EXCEPTIONS.USER_WITH_THAT_EMAIL_ALREADY_EXISTS
          : HTTP_EXCEPTIONS.USER_WITH_THAT_USER_ID_ALREADY_EXISTS,
      );
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new HttpException(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dto,
    });

    return updatedUser;
  }

  async delete(id: string) {
    const payload = await prisma.user.deleteMany({
      where: { id },
    });

    if (payload.count === 0) {
      throw new HttpException(HTTP_EXCEPTIONS.USER_NOT_FOUND);
    }

    return id;
  }
}
