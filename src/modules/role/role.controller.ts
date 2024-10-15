import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './role.dto';
import { BASE_API_URL } from 'src/common/constants';

@Controller(`${BASE_API_URL}/role`)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  create(@Body() payload: CreateRoleDto) {
    return this.roleService.create(payload);
  }
}
