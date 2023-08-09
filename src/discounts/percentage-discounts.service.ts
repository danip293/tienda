import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/entities/order.entity';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderDetail } from 'src/orders/entities/orderDetail.entity';
import { DiscountServiceInterface } from './interface/DiscountServiceInterface';

@Injectable()
export class PercentageDiscountsService implements DiscountServiceInterface {
  apply(
    sale: CreateOrderDto,
    founProducts,
    groupedProducts,
    discountType: string,
  ): Order {
    let totalSale = 0;
    let totalProductsCount = 0;
    const productList: OrderDetail[] = [];

    const discount = Number(discountType.substring(0, discountType.length - 1)); // '12%'
    founProducts.forEach((product) => {
      const currentProductOrderQuantity: number = groupedProducts[product.id];
      const salePrice = product.sale_price * ((100 - discount) / 100);
      const total = salePrice * currentProductOrderQuantity;
      // discount stock to product
      product.stock -= currentProductOrderQuantity;
      // create the order instance
      const orderDetail = new OrderDetail();
      orderDetail.total = total;
      orderDetail.product = product;
      orderDetail.quantity = currentProductOrderQuantity;
      orderDetail.product_discount = discount;
      orderDetail.product_price = product.sale_price;
      orderDetail.product_purchase_price = product.purchase_price;
      orderDetail.product_description = product.description;
      orderDetail.utility = Math.floor(
        ((salePrice - product.purchase_price) / salePrice) * 100,
      );
      // calculate total concept
      totalSale += total;
      totalProductsCount += currentProductOrderQuantity;
      productList.push(orderDetail);
    });
    const order = new Order();
    order.total = totalSale;
    order.total_products = totalProductsCount;
    order.concepts = productList;
    return order;
  }
}
