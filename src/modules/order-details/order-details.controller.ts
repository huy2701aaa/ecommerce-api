import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BASE_API_URL } from 'src/common/constants';
import { OrderDetailsService } from './order-details.service';
import {
  CreateOrderDetailsDto,
  GetListOrderDetailsDto,
  UpdateOrderDetailsDto,
} from './order-details.dto';

@Controller(`${BASE_API_URL}/order-details`)
export class OrderDetailsController {
  constructor(private orderDetailsService: OrderDetailsService) {}

  @Get()
  list(@Query() query: GetListOrderDetailsDto) {
    return this.orderDetailsService.list(query);
  }

  @Get(':id')
  single(@Param('id') id: number) {
    return this.orderDetailsService.single(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDetailsDto) {
    return this.orderDetailsService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateOrderDetailsDto) {
    return this.orderDetailsService.update(payload, id);
  }
}
