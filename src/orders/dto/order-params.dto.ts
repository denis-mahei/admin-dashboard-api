import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderParamsDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  status: string;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsString()
  order: string;
}
