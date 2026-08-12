import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierParamsDto } from './dto/supplier-params.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliers: SuppliersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByQuery(@Query() params: SupplierParamsDto) {
    return await this.suppliers.findAll(params);
  }

  @Get('lookup')
  @UseGuards(JwtAuthGuard)
  async findAllCompanies() {
    return this.suppliers.findAllLookup();
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
