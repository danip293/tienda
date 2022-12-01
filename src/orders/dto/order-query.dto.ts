import { IsOptional, IsPositive } from 'class-validator';
export class OrderQueryDto {
  @IsOptional()
  @IsPositive()
  limit?: number = 50;

  @IsOptional()
  @IsPositive()
  offset?: number = 1;
}
