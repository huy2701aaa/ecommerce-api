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
import { OrderService } from './order.service';
import { CreateOrderDto, GetListOrderDto, UpdateOrderDto } from './order.dto';
import { Roles } from 'src/metadata/auth.metadata';
import { ROLE } from 'src/common/enums';

@Controller(`${BASE_API_URL}/order`)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  list(@Query() query: GetListOrderDto) {
    return this.orderService.list(query);
  }

  @Get('/by-user')
  @Roles(ROLE.USER, ROLE.SUPER_ADMIN)
  listByUser(@Query() query: GetListOrderDto, @Req() req) {
    return this.orderService.listByUser(query, req.user);
  }

  @Get(':id')
  single(@Param('id') id: number) {
    return this.orderService.single(id);
  }

  @Post()
  @Roles(ROLE.USER, ROLE.SUPER_ADMIN)
  create(@Body() payload: CreateOrderDto, @Req() req) {
    return this.orderService.create(payload, req.user);
  }

  @Put(':id')
  @Roles(ROLE.USER, ROLE.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() payload: UpdateOrderDto, @Req() req) {
    return this.orderService.update(id, payload, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
