import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { TenantService } from '../tenants/tenant.service';

@Injectable()
export class UserService {
  constructor(@Inject(TenantService) private tenantService: TenantService) {}

  private getPrismaClient(tenant: any): PrismaClient {
    return this.tenantService.getPrismaClient(tenant);
  }

  async findAll(tenant: any): Promise<User[]> {
    const prisma = this.getPrismaClient(tenant);
    return prisma.user.findMany();
  }

  async findById(tenant: any, categoryId: number): Promise<User | null> {
    const prisma = this.getPrismaClient(tenant);
    return prisma.user.findUnique({
      where: { id: categoryId },
    });
  }
}
