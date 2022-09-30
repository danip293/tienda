import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // este decorador genera la tabla sql, por default elnombre de la clase se utiliza para el npmbre de la tabla, se se quiere especificar un nombre especifico se define como parametro del decorador
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  sku: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'numeric' })
  precio_venta: number;

  @Column({ type: 'numeric' })
  precio_compra: number;

  @Column()
  existencia: number;
}
