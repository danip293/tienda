import { IsNumber, IsString } from 'class-validator';

export class ProductOrderDto {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;
}
