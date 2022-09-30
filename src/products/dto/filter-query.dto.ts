import { IsOptional, IsPositive } from 'class-validator';
export class FilterQueryDto {
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
