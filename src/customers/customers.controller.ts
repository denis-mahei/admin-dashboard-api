import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CustomersParamsDto } from './dto/customers-params.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCustomers(@Query() params: CustomersParamsDto) {
    return await this.customers.findAll(params);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getCustomer(@Param('id', ParseIntPipe) id: number) {
    return await this.customers.findOne(id);
  }
}
