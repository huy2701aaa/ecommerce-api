import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { ROLE } from './common/enums';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEntity } from './entities/user_role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });
  await app.listen(5000);

  const dataSource = await app.get(DataSource);

  await initRole(dataSource);

  await InitSupperAmin(dataSource);
}

async function initRole(dataSource: DataSource) {
  const roleLength = await dataSource.getRepository(RoleEntity).count();

  if (!roleLength) {
    await dataSource.getRepository(RoleEntity).save([
      {
        roleName: ROLE.SUPER_ADMIN,
      },
      {
        roleName: ROLE.ADMIN,
      },
      {
        roleName: ROLE.USER,
      },
    ]);
  }
}

async function InitSupperAmin(dataSource: DataSource) {
  const admin = await dataSource
    .getRepository(UserEntity)
    .findOneBy({ email: 'super_admin@gmail.com' });

  if (!admin) {
    const user = await dataSource.getRepository(UserEntity).save({
      email: 'super_admin@gmail.com',
      password: await bcrypt.hash('123456', 10),
      userName: 'Admin',
    });

    const role = await dataSource
      .getRepository(RoleEntity)
      .findOneBy({ roleName: ROLE.SUPER_ADMIN });

    await dataSource.getRepository(UserRoleEntity).insert({ role, user });
  }
}

bootstrap();
