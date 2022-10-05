import { IsNumber, IsUUID } from 'class-validator';

export class ProductOrderDto {
  @IsUUID()
  id: string;

  @IsNumber()
  quantity: number;
}
