import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliers: SuppliersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.suppliers.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliers.create(createSupplierDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliers.update(id, updateSupplierDto);
  }
}
