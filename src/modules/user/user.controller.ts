import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BASE_API_URL } from 'src/common/constants';
import { GetUserListDto, UpdateUserInfo } from './user.dto';
import { Roles } from 'src/metadata/auth.metadata';
import { ROLE } from 'src/common/enums';

@Controller(`${BASE_API_URL}/user`)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  list(@Query() query: GetUserListDto) {
    return this.userService.getListUser(query);
  }

  @Put()
  @Roles(ROLE.USER, ROLE.SUPER_ADMIN)
  updateInfo(@Body() payload: UpdateUserInfo, @Req() req) {
    return this.userService.updateInfo(payload, req.user);
  }

  @Delete(':id')
  @Roles(ROLE.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
