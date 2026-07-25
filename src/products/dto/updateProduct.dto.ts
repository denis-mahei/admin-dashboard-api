import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  photo: string;
  @IsOptional()
  @IsInt()
  supplierId: number;
  @IsOptional()
  @IsInt()
  stock: number;
  @IsOptional()
  @IsNumber()
  price: number;
  @IsOptional()
  @IsString()
  category: string;
}
