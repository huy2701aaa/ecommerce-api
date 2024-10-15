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
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  GetListCategoryDto,
  UpdateCategoryDto,
} from './category.dto';

@Controller(`${BASE_API_URL}/category`)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  list(@Query() query: GetListCategoryDto) {
    return this.categoryService.list(query);
  }

  @Get(':id')
  single(@Param('id') id: number) {
    return this.categoryService.single(id);
  }

  @Post()
  create(@Body() payload: CreateCategoryDto) {
    return this.categoryService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() payload: UpdateCategoryDto) {
    return this.categoryService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
