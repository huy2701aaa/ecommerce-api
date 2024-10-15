import { COMMON_STATUS } from 'src/common/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('base')
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_id', nullable: true })
  createdId?: number;

  @Column({ name: 'deleted_id', nullable: true })
  deletedId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'varchar', default: COMMON_STATUS.ACTIVE })
  status: COMMON_STATUS.ACTIVE;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'created_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'deleted_id' })
  deletedBy: UserEntity;
}
