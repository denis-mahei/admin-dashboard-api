import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  photo: string;
  @IsNotEmpty()
  @IsInt()
  supplierId: number;
  @IsNotEmpty()
  @IsInt()
  stock: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  category: string;
}
