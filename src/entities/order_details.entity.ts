import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity('order_details')
export class OrderDetailsEntity extends BaseEntity {
  @Column({ type: 'int', name: 'order_id', nullable: false })
  orderId: number;

  @Column({ type: 'int', name: 'product_id', nullable: false })
  productId: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', nullable: false })
  size: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
