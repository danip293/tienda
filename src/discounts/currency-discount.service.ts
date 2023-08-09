import { Injectable } from '@nestjs/common';
import { Order } from 'src/orders/entities/order.entity';
import { DiscountServiceInterface } from './interface/DiscountServiceInterface';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderDetail } from 'src/orders/entities/orderDetail.entity';

@Injectable()
export class CurrencyDiscountsService implements DiscountServiceInterface {
  apply(
    sale: CreateOrderDto,
    founProducts,
    groupedProducts,
    discountType: number,
  ): Order {
    let totalSale = 0;
    let totalProductsCount = 0;
    const productList: OrderDetail[] = [];
    const discountUnit = discountType / founProducts.length;

    founProducts.forEach((product) => {
      const currentProductOrderQuantity: number = groupedProducts[product.id];
      const salePrice =
        product.sale_price - discountUnit * currentProductOrderQuantity;

      const total = salePrice * currentProductOrderQuantity;
      // discount stock to product
      product.stock -= currentProductOrderQuantity;
      // create the order instance
      const orderDetail = new OrderDetail();
      orderDetail.total = total;
      orderDetail.product = product;
      orderDetail.quantity = currentProductOrderQuantity;
      orderDetail.product_discount = discountUnit * currentProductOrderQuantity;
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
