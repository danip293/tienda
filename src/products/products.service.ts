import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  /**
   * It takes a FilterQueryDto object as an argument, and returns a list of products that match the
   * criteria specified in the FilterQueryDto object
   * @param {FilterQueryDto} filterQueryDto - FilterQueryDto
   * @returns product list
   */
  list(filterQueryDto: FilterQueryDto) {
    const {
      offset,
      limit,
      order_name,
      order_price,
      name,
      upc,
      min_price,
      max_price,
    } = filterQueryDto;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .skip(offset - 1)
      .take(limit)
      .where('1=1');

    if (name) {
      queryBuilder.andWhere('product.name like :name', {
        name: `%${name}%`,
      });
    }
    if (upc) {
      queryBuilder.andWhere('product.upc like :upc', {
        upc: `%${upc}%`,
      });
    }

    if (min_price) {
      queryBuilder.andWhere('product.sale_price >= :min_price', {
        min_price,
      });
    }
    if (max_price) {
      queryBuilder.andWhere('product.sale_price <= :max_price', {
        max_price,
      });
    }

    if (order_name && order_price) {
      queryBuilder
        .orderBy(
          'product.name',
          order_name.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        )
        .addOrderBy(
          'product.sale_price',
          order_price.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        );
    } else if (order_name) {
      queryBuilder.orderBy(
        'product.name',
        order_name.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    } else if (order_price) {
      queryBuilder.orderBy(
        'product.sale_price',
        order_price.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    }

    return queryBuilder.getMany();
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
