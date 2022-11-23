import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly upc: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly sale_price: number;

  @IsNumber()
  readonly purchase_price: number;

  @IsNumber()
  readonly stock: number;
}
