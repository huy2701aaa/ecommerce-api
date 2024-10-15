import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatEntity } from 'src/entities/chat.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateChatDto, GetListChatDto, UpdateChatDto } from './chat.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/common/constants';
import { UserEntity } from 'src/entities/user.entity';
import { CHAT_NOT_FOUND, USER_NOT_FOUND } from 'src/common/error';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async list(payload: GetListChatDto) {
    const limit = payload.limit || DEFAULT_LIMIT;
    const page = payload.page || DEFAULT_PAGE;

    return await this.chatRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        fromUser: true,
        toUser: true,
      },
      select: {
        fromUser: {
          userName: true,
          email: true,
        },
        toUser: {
          userName: true,
          email: true,
        },
      },
    });
  }

  async getByUser(userId: number) {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    return this.chatRepository.find({
      where: {
        fromId: user.id,
      },
      relations: {
        toUser: true,
      },
      select: {
        toUser: {
          userName: true,
          email: true,
        },
      },
    });
  }

  async create(payload: CreateChatDto) {
    const fromUser = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: payload.fromId });

    if (!fromUser) throw new NotFoundException(USER_NOT_FOUND);

    const toUser = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: payload.toId });

    if (!toUser) throw new NotFoundException(USER_NOT_FOUND);

    await this.chatRepository.insert(payload);

    return { message: 'success' };
  }

  async update(id: number, payload: UpdateChatDto) {
    const fromUser = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: payload.fromId });

    if (!fromUser) throw new NotFoundException(USER_NOT_FOUND);

    const toUser = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: payload.toId });

    if (!toUser) throw new NotFoundException(USER_NOT_FOUND);

    const chat = await this.chatRepository.findOneBy({ id });

    if (!chat) throw new NotFoundException(CHAT_NOT_FOUND);

    await this.chatRepository.update(id, payload);

    return { message: 'success' };
  }

  async delete(id: number) {
    const chat = await this.chatRepository.findOneBy({ id });

    if (!chat) throw new NotFoundException(CHAT_NOT_FOUND);

    await this.chatRepository.softDelete(chat.id);

    return { message: 'success' };
  }
}
