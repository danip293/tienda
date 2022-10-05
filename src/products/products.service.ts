import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';

// Entities
import { Product } from './entities/product.entity';

// Dto
import { FilterQueryDto } from './dto/filter-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  list(filterQueryDto: FilterQueryDto) {
    const { offset, limit } = filterQueryDto;
    return this.productRepository.find({ skip: offset - 1, take: limit });
  }

  /**
   * It retrieves a product from the database, and if it doesn't exist, it throws an error
   * @param {string} id - string - The id of the product we want to retrieve.
   * @returns The product that was found.
   */
  async retrieve(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} was not found`);
    }
    return product;
  }

  create(productBody) {
    const coffee = this.productRepository.create({
      ...productBody,
    });
    return this.productRepository.save(coffee);
  }

  /**
   * It takes an id and a productBody, preloads the product with the id and the productBody, and then
   * saves the product
   * @param {string} id - string - The id of the product we want to update.
   * @param productBody - This is the body of the request.
   * @returns The updated product
   */
  async update(id: string, productBody) {
    const product = await this.productRepository.preload({
      id: +id,
      ...productBody,
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} was not found`);
    }
    return this.productRepository.save(product);
  }

  /**
   * Find a coffee by its ID, then delete it.
   * @param {string} id - string - The id of the coffee we want to delete.
   * @returns The coffee object that was deleted.
   */
  async delete(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    return this.productRepository.remove(product);
  }
}
