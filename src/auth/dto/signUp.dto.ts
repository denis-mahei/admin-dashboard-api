import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({ example: 'johndoe@mail.com', description: 'email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'password123', description: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty({ example: 'John Doe', description: 'Name' })
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty({ example: '+380987654321', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone: string;
}
