import { IsNotEmpty, IsString } from 'class-validator';

export class CheckOutDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
