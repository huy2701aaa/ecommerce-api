import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import {
  CreateCommentDto,
  GetListCommentDto,
  UpdateCommentDto,
} from './comment.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import {
  COMMENT_NOT_FOUND,
  PRODUCT_NOT_FOUND,
  USER_NOT_FOUND,
} from 'src/common/error';
import { ProductEntity } from 'src/entities/product.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TResult } from 'src/common/types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(payload: GetListCommentDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    const where: FindOptionsWhere<CommentEntity> = {};

    if (payload.productId) {
      where.productId = payload.productId;
    }

    const data = await this.commentRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
      where,
      select: {
        user: {
          userName: true,
          email: true,
        },
        id: true,
        content: true,
        image: true,
        productId: true,
        createdAt: true,
      },
      order: {
        id: 'DESC',
      },
    });

    return { data } as TResult;
  }

  async listByUser(payload: GetListCommentDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    const where: FindOptionsWhere<CommentEntity> = {};

    if (payload.productId) {
      where.productId = payload.productId;
    }

    const data = await this.commentRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
      where,
      select: {
        user: {
          userName: true,
        },
        id: true,
        content: true,
        image: true,
        productId: true,
      },
    });

    return { data } as TResult;
  }

  async create(payload: CreateCommentDto, userId: number) {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const product = await this.dataSource
      .getRepository(ProductEntity)
      .findOneBy({ id: payload.productId });

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    await this.commentRepository.insert({ ...payload, userId });

    return { message: 'Thêm bình luận thành công' };
  }

  async update(id: number, payload: UpdateCommentDto) {
    const user = await this.dataSource
      .getRepository(CommentEntity)
      .findOneBy({ id: payload.userId });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const product = await this.dataSource
      .getRepository(ProductEntity)
      .findOneBy({ id: payload.productId });

    if (!product) throw new NotFoundException(PRODUCT_NOT_FOUND);

    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND);

    await this.commentRepository.update(id, payload);

    return { message: ' Cập nhật bình luận thành công' };
  }

  async delete(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND);

    await this.commentRepository.softDelete(id);

    return { message: 'Xóa bình luận thành công' };
  }
}
