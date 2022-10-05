import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Order } from './order.entitiy';

@Entity()
export class OrderDetail {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column()
  quantity: number;

  @Column({ type: 'numeric' })
  total: number;

  @Column()
  utility: number;

  @Column()
  product_discount: number;

  @Column({ type: 'numeric' })
  product_price: number;

  @Column({ type: 'numeric' })
  product_purchase_price: number;

  @Column({ nullable: true })
  product_description: string;

  @PrimaryColumn()
  order_id: string;

  @PrimaryColumn()
  product_id: string;

  @ManyToOne(() => Order, (order) => order.concepts)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;
}
