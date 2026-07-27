import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import type { Request } from 'express';
import { CheckOutDto } from './dto/checkout.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCartItems(@Req() req: Request) {
    const userId = req.user.sub;
    return this.cartService.findAll(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() createCartDto: CreateCartDto) {
    return this.cartService.orderCreate(req.user.sub, createCartDto);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: Request, @Body() checkoutDto: CheckOutDto) {
    return this.cartService.checkout(req.user.sub, checkoutDto);
  }
}
