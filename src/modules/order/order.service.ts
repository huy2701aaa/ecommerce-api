import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import { ORDER_NOT_FOUND, USER_NOT_FOUND } from 'src/common/error';
import { CreateOrderDto, GetListOrderDto, UpdateOrderDto } from './order.dto';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderDetailsEntity } from 'src/entities/order_details.entity';
import { MailService } from '../mail/mail.service';
import { TResult } from 'src/common/types';
import { ORDER_STATUS, ROLE } from 'src/common/enums';
import { UserRoleEntity } from 'src/entities/user_role.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ProductEntity } from 'src/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async list(payload: GetListOrderDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    const where: FindOptionsWhere<OrderEntity> = {};

    if (payload.orderStatus) {
      where.orderStatus = payload.orderStatus;
    }

    const data = await this.orderRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: {
          userInfo: true,
        },
        orderDetails: true,
      },
      select: {
        user: {
          userName: true,
          email: true,
        },
      },
      where,
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
    } as TResult;
  }

  async listByUser(payload: GetListOrderDto, userId: number) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    const data = await this.orderRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
        orderDetails: {
          product: true,
        },
      },
      select: {
        user: {
          id: true,
          email: true,
        },
      },
      where: {
        userId,
      },
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
    } as TResult;
  }

  async single(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: {
          userInfo: true,
        },
        orderDetails: {
          product: true,
        },
      },
      select: {
        user: {
          email: true,
        },
      },
    });

    if (!order) throw new NotFoundException(ORDER_NOT_FOUND);

    return { data: order } as TResult;
  }

  async create(payload: CreateOrderDto, userId: number) {
    const order = await this.orderRepository.insert({ ...payload, userId });

    const token = Math.floor(1000 + Math.random() * 9000).toString();

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    try {
      await this.mailService.sendUserWelcome(user.email, token);
    } catch (error) {
      console.log(error);
    }

    return {
      statusCode: 201,
      message: 'Tạo đơn hàng thành công',
      data: order.raw.insertId,
    } as TResult;
  }

  async update(id: number, { orderStatus }: UpdateOrderDto, userId: number) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) throw new BadRequestException(ORDER_NOT_FOUND);

    const user = await this.dataSource.getRepository(UserRoleEntity).findOne({
      where: {
        userId,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (
      user.role.roleName !== ROLE.SUPER_ADMIN &&
      orderStatus === ORDER_STATUS.CANCEL &&
      order.orderStatus !== ORDER_STATUS.PENDING
    ) {
      throw new BadRequestException(
        'Đơn hàng đã được duyệt, không thể hủy đơn hàng',
      );
    }

    await this.orderRepository.update(id, { orderStatus });

    if (order.orderDetails?.length) {
      await Promise.all(
        order.orderDetails.map(async (item) => {
          const product = await this.dataSource
            .getRepository(ProductEntity)
            .findOneBy({ id: item.product.id });
          if (product) {
            await this.dataSource
              .getRepository(ProductEntity)
              .update(
                { id: product.id },
                { sold: product.sold + item.quantity },
              );
          }
        }),
      );
    }

    return {
      statusCode: 200,
      message: 'Cập nhật đơn hàng thành công',
    };
  }

  async delete(id: number) {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) throw new BadRequestException(ORDER_NOT_FOUND);

    await this.orderRepository.softDelete(id);

    const orderDetailsIds = await this.dataSource
      .getRepository(OrderDetailsEntity)
      .find({
        where: {
          orderId: order.id,
        },
        select: ['id'],
      });

    if (orderDetailsIds.length) {
      await Promise.all(
        orderDetailsIds.map(async (item) => {
          await this.dataSource
            .getRepository(OrderDetailsEntity)
            .softDelete(item.id);
        }),
      );
    }

    return {
      statusCode: 200,
      message: 'Xóa đon hàng thành công',
    };
  }
}
