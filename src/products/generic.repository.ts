import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterQueryProductDto } from './dto/filter-query.product';

// type queryCb<T> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;

export class GenericRepository<T> extends Repository<T> {
  async getEntity(id: number): Promise<T> {
    return await this.findOne(id);
  }

  async getEntities(
    query: FilterQueryProductDto,
    // queryCallback: queryCb<T>,
  ): Promise<[T[], number]> {
    const {
      offset,
      limit,
      order_name,
      order_price,
      name,
      upc,
      min_price,
      max_price,
    } = query;

    const queryBuilder = this.createQueryBuilder('product')
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

    // const customQuery = queryCallback(queryBuilder);

    return queryBuilder.getManyAndCount();
  }
}
