import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductParamsDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  category: string;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsString()
  order: string;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number;
}
