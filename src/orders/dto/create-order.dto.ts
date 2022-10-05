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
} from 'class-validator';
import { ProductOrderDto } from './product-order-dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsNumber()
  @IsOptional()
  discount?: number = 0;
}
