import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Aspirin' })
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
