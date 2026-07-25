import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsString()
  company: string;
  @IsOptional()
  @IsDateString()
  date: string;
  @IsOptional()
  @IsNumber()
  amount: number;
  @IsOptional()
  @IsString()
  status: string;
}
