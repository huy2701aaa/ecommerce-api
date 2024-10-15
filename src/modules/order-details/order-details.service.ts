import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailsEntity } from 'src/entities/order_details.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CreateOrderDetailsDto,
  GetListOrderDetailsDto,
  UpdateOrderDetailsDto,
} from './order-details.dto';
import { ProductEntity } from 'src/entities/product.entity';
import {
  ORDER_DETAILS_NOT_FOUND,
  ORDER_NOT_FOUND,
  PRODUCT_NOT_FOUND,
} from 'src/common/error';
import { OrderEntity } from 'src/entities/order.entity';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetailsEntity)
    private readonly orderDetailsRepository: Repository<OrderDetailsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(payload: GetListOrderDetailsDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    return await this.orderDetailsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        product: true,
        order: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async single(id: number) {
    const orderDetails = await this.orderDetailsRepository.findOne({
      where: {
        id,
      },
      relations: {
        product: true,
        order: true,
      },
    });

    if (!orderDetails) throw new NotFoundException(ORDER_DETAILS_NOT_FOUND);

    return orderDetails;
  }

  async create(payload: CreateOrderDetailsDto) {
    const product = await this.dataSource
      .getRepository(ProductEntity)
      .findOneBy({ id: payload.productId });

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    const order = await this.dataSource
      .getRepository(OrderEntity)
      .findAndCountBy({ id: payload.orderId });

    if (!order) throw new NotFoundException(ORDER_NOT_FOUND);

    await this.orderDetailsRepository.insert(payload);

    return { message: 'success' };
  }

  async update(payload: UpdateOrderDetailsDto, id: number) {
    const product = await this.dataSource
      .getRepository(ProductEntity)
      .findOneBy({ id: payload.productId });

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    const order = await this.dataSource
      .getRepository(OrderEntity)
      .findAndCountBy({ id: payload.orderId });

    if (!order) throw new NotFoundException(ORDER_NOT_FOUND);

    const orderDetails = await this.orderDetailsRepository.findOneBy({ id });

    if (!orderDetails) throw new NotFoundException(ORDER_DETAILS_NOT_FOUND);

    await this.orderDetailsRepository.update({ id }, payload);

    return { message: 'success' };
  }
}
