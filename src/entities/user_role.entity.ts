import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryColumn({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @PrimaryColumn({ type: 'int', name: 'role_id', nullable: false })
  roleId: number;

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

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
