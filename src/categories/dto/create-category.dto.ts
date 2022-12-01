import { IsString } from 'class-validator';

IsString;
export class CreateCategoryDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
}
