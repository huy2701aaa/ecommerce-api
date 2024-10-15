import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BASE_API_URL } from 'src/common/constants';
import { ChatService } from './chat.service';
import { CreateChatDto, GetListChatDto, UpdateChatDto } from './chat.dto';
import { Roles } from 'src/metadata/auth.metadata';
import { ROLE } from 'src/common/enums';

@Roles(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN)
@Controller(`${BASE_API_URL}/chat`)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  list(@Query() query: GetListChatDto) {
    return this.chatService.list(query);
  }

  @Get('by-user')
  getByUser(@Req() req) {
    return this.chatService.getByUser(req.user);
  }

  @Post()
  create(@Body() payload: CreateChatDto) {
    return this.chatService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateChatDto) {
    return this.chatService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.chatService.delete(id);
  }
}
