import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
