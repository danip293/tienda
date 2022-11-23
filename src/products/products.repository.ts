import { EntityRepository, Repository } from 'typeorm';
// Entities
import { Product } from './entities/product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
