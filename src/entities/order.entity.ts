import { ORDER_STATUS, PAYMENT_TYPE } from 'src/common/enums';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { OrderDetailsEntity } from './order_details.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', name: 'total_money', nullable: false })
  totalMoney: string;

  @Column({ type: 'varchar', name: 'user_note' })
  userNote: string;

  @Column({
    type: 'varchar',
    name: 'payment_type',
    default: PAYMENT_TYPE.NORMAL,
  })
  paymentType: string;

  @Column({ type: 'varchar', nullable: false, default: ORDER_STATUS.PENDING })
  orderStatus: ORDER_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderDetailsEntity, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetailsEntity[];
}
