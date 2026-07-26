import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCustomers() {
    return await this.customers.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCustomer(@Param('id', ParseIntPipe) id: number) {
    return await this.customers.findOne(id);
  }
}
