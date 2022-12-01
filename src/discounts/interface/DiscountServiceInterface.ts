import { Order } from 'src/orders/entities/order.entitiy';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

export interface DiscountServiceInterface {
  apply(
    sale: CreateOrderDto,
    founProducts,
    groupedProducts,
    discountType: string | number,
  ): Order;
}
