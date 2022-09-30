import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly nombre: string;

  @IsString()
  readonly sku: string;

  @IsString()
  @IsOptional()
  readonly descripcion: string;

  @IsNumber()
  readonly precio_venta: number;

  @IsNumber()
  readonly precio_compra: number;

  @IsNumber()
  readonly existencia: number;
}
