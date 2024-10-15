import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @Column({ type: 'int', name: 'product_id', nullable: false })
  productId: number;

  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.comments)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
