import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto, ForgetPassDto, LoginAuthDto } from './auth.dto';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EMAIL_NOT_FOUND,
  PASSWORD_INCORRECT,
  USER_EXISTED,
  USER_NOT_FOUND,
} from 'src/common/error';
import * as bcrypt from 'bcrypt';
import { UserRoleEntity } from 'src/entities/user_role.entity';
import { RoleEntity } from 'src/entities/role.entity';
import { ROLE } from 'src/common/enums';
import { JwtService } from '@nestjs/jwt';
import { TResult } from 'src/common/types';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(payload: CreateAuthDto) {
    try {
      // Mã hoá mật khẩu
      const hashPassword = await bcrypt.hash(payload.password, 10);

      payload.password = hashPassword;

      const user = await this.userRepository.save(payload);

      const role = await this.dataSource
        .getRepository(RoleEntity)
        .findOneBy({ roleName: ROLE.USER });

      if (role) {
        await this.dataSource
          .getRepository(UserRoleEntity)
          .insert({ userId: user.id, roleId: role.id });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restData } = user;

      return {
        message: 'Tạo tài khoản thành công',
        statusCode: 201,
        data: restData,
      } as TResult;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(USER_EXISTED);
      }
    }
  }

  async login(payload: LoginAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
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
        password: true,
        userRoles: {
          roleId: true,
          role: {
            roleName: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    // Giải mã mật khẩu
    const isMatch = await bcrypt.compare(payload.password, user.password);

    if (!isMatch) {
      throw new BadRequestException(PASSWORD_INCORRECT);
    }

    const subject = {
      userId: user.id,
      username: user.userName,
      roleName: user.userRoles.map((role) => role.role.roleName),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restData } = user;

    return {
      data: {
        ...restData,
        accessToken: await this.jwtService.signAsync(subject),
      },
      message: 'Đăng nhập thành công',
      statusCode: 200,
    } as TResult;
  }

  async forgetPass(payload: ForgetPassDto) {
    const user = await this.userRepository.findOneBy({ email: payload.email });

    if (!user) throw new NotFoundException(EMAIL_NOT_FOUND);

    const newPassword = '123456';

    await this.userRepository.update(
      { id: user.id },
      { password: await bcrypt.hash(newPassword, 10) },
    );

    const token = Math.floor(1000 + Math.random() * 9000).toString();

    await this.mailService.resetPassword(user.email, token, newPassword);

    return {
      statusCode: 200,
      message: 'Khôi phục mật khẩu thành công !',
    } as TResult;
  }

  generateRandomPassword(length: any) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allChars = lowerCase + upperCase + numbers + specialChars;
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }

    return password;
  }
}
