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
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  GetListCommentDto,
  UpdateCommentDto,
} from './comment.dto';
import { Roles } from 'src/metadata/auth.metadata';
import { ROLE } from 'src/common/enums';

@Controller(`${BASE_API_URL}/comment`)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  list(@Query() query: GetListCommentDto) {
    return this.commentService.list(query);
  }

  @Post()
  @Roles(ROLE.USER, ROLE.SUPER_ADMIN)
  create(@Body() payload: CreateCommentDto, @Req() req) {
    return this.commentService.create(payload, req.user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateCommentDto) {
    return this.commentService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.commentService.delete(id);
  }
}
