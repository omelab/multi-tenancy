import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma, Tenant } from '@prisma/client';
import { CreateTenantDto } from './dto/create.dto';
import { migrateTenantDatabases } from '../../migrations/migrateTenantDatabases';
import { PaginationResult } from 'src/shared/interface/pagination-result.interface';

@Injectable()
export class TenantService implements OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getPrismaClient(tenant: Tenant): PrismaClient {
    // Create a new instance of the Prisma client with the tenant-specific database connection
    const tenantPrisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://${tenant.dbUsername}:${tenant.dbPassword}@${tenant.dbHost}:${tenant.dbPort}/${tenant.dbName}`,
        },
      },
    });

    return tenantPrisma;
  }

  onModuleDestroy() {
    // Disconnect the main Prisma client instance when the service is destroyed
    if (this.prisma) {
      this.prisma.$disconnect();
    }
  }

  //create new tenant
  async createTenant(tenantData: CreateTenantDto): Promise<Tenant> {
    const newTenant = await this.prisma.tenant.create({
      data: tenantData,
    });

    // Step 2: Run migrations for specific models for the new tenant's database
    try {
      await migrateTenantDatabases(newTenant.id);
      console.log(`Migrations completed for the new tenant: ${newTenant.name}`);
    } catch (error) {
      console.error(
        `Error running migrations for the new tenant: ${newTenant.name}`,
      );
      // You can handle the error as per your requirements.
      // For example, you may want to delete the newly created tenant and handle the error gracefully.
      throw error;
    }

    return newTenant;
  }

  //get all tenants
  async findAll(
    page = 1,
    limit = 10,
    where: Prisma.TenantWhereInput = { deletedAt: null },
    orderBy: Prisma.TenantOrderByWithRelationInput = { id: 'desc' },
  ): Promise<PaginationResult<Tenant>> {
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.tenant.count({
        where,
      }),
    ]);

    const perPage = data.length;
    const currentPage = page;
    const nextPage = totalCount > skip + perPage ? page + 1 : undefined;

    return {
      data,
      totalCount,
      currentPage,
      perPage,
      nextPage,
    };
  }
}
