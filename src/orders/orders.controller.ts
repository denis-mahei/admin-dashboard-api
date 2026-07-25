import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { OrderParamsDto } from './dto/order-params.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts(@Query() params: OrderParamsDto) {
    return this.orders.findAll(params);
  }
}
