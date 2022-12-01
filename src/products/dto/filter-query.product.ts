import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsIn,
} from 'class-validator';
import { FilterQueryDto } from './filter-query.dto';

export class FilterQueryProductDto extends FilterQueryDto {
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
