import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import {
  CreateCategoryDto,
  GetListCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import { CATEGORY_EXISTED, CATEGORY_NOT_FOUND } from 'src/common/error';
import { TResult } from 'src/common/types';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async list(payload: GetListCategoryDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;
    const where: FindOptionsWhere<CategoryEntity> = {};

    if (payload.q) {
      where.name = Like(`%${payload.q}%`);
    }

    const data = await this.categoryRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where,
      relations: {
        products: true,
      },
      order: {
        id: 'DESC',
      },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách danh mục thành công',
      data,
    } as TResult;
  }

  async single(id: number) {
    const data = await this.categoryRepository.findOneBy({ id });

    if (!data) throw new NotFoundException(CATEGORY_NOT_FOUND);

    return {
      statusCode: 200,
      message: 'Lấy danh mục thành công',
      data,
    } as TResult;
  }

  async create(payload: CreateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      name: payload.name,
    });

    if (category) {
      throw new BadRequestException(CATEGORY_EXISTED);
    }

    await this.categoryRepository.insert(payload);

    return {
      statusCode: 201,
      message: 'Tạo danh mục thành công',
    };
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    await this.categoryRepository.update(id, payload);

    return {
      statusCode: 200,
      message: 'Cập nhật danh mục thành công',
    };
  }

  async delete(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    await this.categoryRepository.softDelete(id);

    return {
      statusCode: 200,
      message: 'Xóa danh mục thành công',
    };
  }
}
