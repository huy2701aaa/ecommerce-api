import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsOrderValue,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import {
  CATEGORY_NOT_FOUND,
  PRODUCT_DUPLICATE_NAME,
  PRODUCT_NOT_FOUND,
} from 'src/common/error';
import { ProductEntity } from 'src/entities/product.entity';
import {
  CreateProductDto,
  GetListProductDto,
  UpdateProductDto,
} from './product.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import { TResult } from 'src/common/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(payload: GetListProductDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;
    const order: {
      newPrice?: FindOptionsOrderValue;
      id?: FindOptionsOrderValue;
    } = {};
    const where: FindOptionsWhere<ProductEntity> = {};

    if (payload.q) {
      where.name = Like(`%${payload.q}%`);
    }

    if (payload.size) {
      where.size = Like(`%${payload.size}%`);
    }

    if (payload.color) {
      where.color = Like(`%${payload.color}%`);
    }

    if (payload.categoryId) {
      where.categoryId = payload.categoryId;
    }

    if (payload.price) {
      order.newPrice = payload.price as FindOptionsOrderValue;
    } else {
      order.id = 'DESC';
    }

    const data = await this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order,
    });

    return {
      statusCode: 200,
      message: 'Lấy danh sách sản phẩm thành công',
      data,
    } as TResult;
  }

  async single(id: number) {
    const data = await this.productRepository.findOneBy({ id });

    if (!data) throw new NotFoundException(PRODUCT_NOT_FOUND);

    return {
      statusCode: 200,
      message: 'Lấy sản phẩm thành công',
      data,
    } as TResult;
  }

  async create(payload: CreateProductDto) {
    const category = await this.dataSource
      .getRepository(CategoryEntity)
      .findOneBy({ id: payload.categoryId });

    if (!category) {
      throw new BadRequestException(CATEGORY_NOT_FOUND);
    }

    const checkNameExsited = await this.productRepository.findOneBy({
      name: payload.name,
    });

    if (checkNameExsited) throw new BadRequestException(PRODUCT_DUPLICATE_NAME);

    await this.productRepository.insert(payload);

    return {
      statusCode: 201,
      message: 'Tạo sản phẩm thành công',
    } as TResult;
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new BadRequestException(PRODUCT_NOT_FOUND);

    const category = await this.dataSource
      .getRepository(CategoryEntity)
      .findOneBy({ id: payload.categoryId });

    if (!category) throw new BadRequestException(CATEGORY_NOT_FOUND);

    await this.productRepository.update(id, payload);

    return {
      statusCode: 200,
      message: 'Cập nhật sản phẩm thành công',
    } as TResult;
  }

  async delete(id: number) {
    const category = await this.productRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND);
    }

    await this.productRepository.softDelete(id);

    return {
      statusCode: 200,
      message: 'Xóa sản phẩm thành công',
    } as TResult;
  }

  async getProductSellTheMost() {
    try {
      const product = await this.productRepository.find({
        order: {
          sold: 'DESC',
        },
        take: 1,
      });

      return { data: product[0] } as TResult;
    } catch (error) {
      console.log(error);
    }
  }
}
