import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_NOT_FOUND } from 'src/common/error';
import { UserEntity } from 'src/entities/user.entity';
import { UserRoleEntity } from 'src/entities/user_role.entity';
import { DataSource, FindOptionsWhere, Like, Not, Repository } from 'typeorm';
import { GetUserListDto, UpdateUserInfo } from './user.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import { UserInfoEntity } from 'src/entities/user_info.entity';
import { userInfo } from 'os';
import { TResult } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        userRoles: {
          role: true,
        },
        userInfo: true,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        userRoles: {
          roleId: true,
          role: {
            roleName: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    return user;
  }

  async getRoleUser(userId: number) {
    const user = await this.dataSource.getRepository(UserRoleEntity).find({
      where: {
        userId,
      },
      relations: ['role'],
      select: {
        role: {
          roleName: true,
        },
      },
    });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const roles = user.map((item) => item.role.roleName);

    return roles;
  }

  async getListUser(payload: GetUserListDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    const where: FindOptionsWhere<UserEntity> = {};

    if (payload.q) {
      where.email = Like(`%${payload.q}%`);
    }

    where.email = Not('super_admin@gmail.com');

    const data = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        userRoles: {
          role: true,
        },
        userInfo: true,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        status: true,
        userRoles: {
          roleId: true,
          role: {
            roleName: true,
          },
        },
      },
      where,
      order: {
        id: 'DESC',
      },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      data,
    } as TResult;
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        userInfo: true,
      },
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    await this.userRepository.softDelete(id);

    if (user.userInfo)
      await this.dataSource
        .getRepository(userInfo)
        .softRemove({ id: user.userInfo.id });

    return { message: 'Xoá người dùng thành công' } as TResult;
  }

  async updateInfo(payload: UpdateUserInfo, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        userInfo: true,
      },
    });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    if (!user.userInfo) {
      const userInfo = await this.dataSource
        .getRepository(UserInfoEntity)
        .save(payload);

      await this.dataSource
        .getRepository(UserEntity)
        .update({ id: userId }, { userInfo });
    } else {
      await this.dataSource
        .getRepository(UserInfoEntity)
        .update({ id: user.userInfo.id }, payload);
    }

    return { message: 'success' };
  }
}
