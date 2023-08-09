import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityRepository, Repository } from 'typeorm';
// Entities
import { Product } from './entities/product.entity';
import { GenericRepository } from './generic.repository';

@EntityRepository(Product)
export class ProductRepository extends GenericRepository<Product> {
  //   constructor(@InjectConnection() connection: Connection) {
  //     super();
  //   }
}
