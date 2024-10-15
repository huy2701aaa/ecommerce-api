import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { ROLE_EXISTED } from 'src/common/error';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateRoleDto) {
    try {
      return await this.roleRepository.save(payload);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(ROLE_EXISTED);
      }
    }
  }
}
