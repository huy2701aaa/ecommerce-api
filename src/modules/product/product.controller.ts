import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BASE_API_URL } from 'src/common/constants';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  GetListProductDto,
  UpdateProductDto,
} from './product.dto';

@Controller(`${BASE_API_URL}/product`)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  list(@Query() query: GetListProductDto) {
    return this.productService.list(query);
  }

  @Get('/sell-the-most')
  getProductSellTheMost() {
    return this.productService.getProductSellTheMost();
  }

  @Get(':id')
  single(@Param('id') id: number) {
    return this.productService.single(id);
  }

  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateProductDto) {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
