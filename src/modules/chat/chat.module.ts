import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from 'src/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity])],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
