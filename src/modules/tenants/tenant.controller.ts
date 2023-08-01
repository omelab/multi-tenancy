import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { PaginationResult } from 'src/shared/interface/pagination-result.interface';
import { CreateTenantDto } from './dto/create.dto';

@ApiTags('Tenant')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() tanentDto: CreateTenantDto) {
    return this.tenantService.createTenant(tanentDto);
  }

  @Get()
  async findAll(@Query() query: any): Promise<PaginationResult<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const where: any = { deletedAt: null };

    if (query.name && query.name !== '') {
      where.name = query.name;
    }

    if (query.email && query.email !== '') {
      where.email = { contains: query.email, mode: 'insensitive' };
    }

    return await this.tenantService.findAll(page, limit, where);
  }
}
