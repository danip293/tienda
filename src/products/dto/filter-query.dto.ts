import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
  ValidateIf,
} from 'class-validator';
export class FilterQueryDto {
  @IsOptional()
  @IsPositive()
  limit?: number = 50;

  @IsOptional()
  @IsPositive()
  offset?: number = 1;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  upc: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  min_price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  max_price: number;

  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC', 'desc', 'asc'])
  order_name: string;

  @IsOptional()
  @IsString()
  @IsIn(['DESC', 'ASC', 'desc', 'asc'])
  order_price: string;
}
