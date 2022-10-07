import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  MinLength,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ValidateIf,
  IsIn,
} from 'class-validator';

import { ProductOrderDto } from './product-order-dto';

const availableDiscounts = [10, 20];
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @ValidateIf((o) => o.discount)
  @IsIn(availableDiscounts)
  discount?: number = 0;
}
