import { Controller, Get } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @Get()
  async getAll() {
    return this.stores.findAll();
  }

  @Get('nearest')
  async getNearest() {
    return this.stores.findNearest();
  }
}
