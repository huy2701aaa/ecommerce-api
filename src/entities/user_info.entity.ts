import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user_info')
export class UserInfoEntity extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;
}
