import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
