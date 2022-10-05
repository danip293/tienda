import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // este decorador genera la tabla sql, por default elnombre de la clase se utiliza para el npmbre de la tabla, se se quiere especificar un nombre especifico se define como parametro del decorador
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  upc: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'numeric' })
  sale_price: number;

  @Column({ type: 'numeric' })
  purchase_price: number;

  @Column()
  stock: number;
}
