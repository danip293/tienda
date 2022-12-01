import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entities

import { ProductRepository } from './products.repository';

// Dto
import { FilterQueryProductDto } from './dto/filter-query.product';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * It takes a FilterQueryDto object as an argument, and returns a list of products that match the
   * criteria specified in the FilterQueryDto object
   * @param {FilterQueryProductDto} filterQueryDto - FilterQueryDto
   * @returns product list
   */
  list(filterQueryDto: FilterQueryProductDto) {
    return this.productRepository.getEntities(filterQueryDto);
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

  async create(productBody) {
    const { upc } = productBody;
    const foundProduct = await this.productRepository.findOne({
      where: { upc },
    });
    if (foundProduct) {
      throw new BadRequestException(`Product with upc:${upc} already exist`);
    }

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
      id,
      ...productBody,
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} was not found`);
    }
    const res = await this.productRepository.save(product);
    return res;
  }

  /**
   * Find a coffee by its ID, then delete it.
   * @param {string} id - string - The id of the coffee we want to delete.
   * @returns The coffee object that was deleted.
   */
  async delete(id: string) {
    const product = await this.productRepository.findOne(id);
    return await this.productRepository.remove(product);
  }
}
