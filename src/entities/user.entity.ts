import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserRoleEntity } from './user_role.entity';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { CommentEntity } from './comment.entity';
import { ChatEntity } from './chat.entity';
import { UserInfoEntity } from './user_info.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'user_name', nullable: false })
  userName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'int', name: 'user_info_id', nullable: true })
  userInfoId: number;

  @OneToMany(() => UserRoleEntity, (role) => role.user)
  userRoles: UserRoleEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.toUser)
  chats: ChatEntity[];

  @OneToOne(() => UserInfoEntity)
  @JoinColumn({ name: 'user_info_id' })
  userInfo: UserInfoEntity;
}
