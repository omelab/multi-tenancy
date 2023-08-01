// src/middleware/tenant.middleware.ts
import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaClient) {}

  async resolve() {
    return (req: Request, res: Response, next: NextFunction) => {
      this.use(req, res, next);
    };
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // Logic to identify the tenant based on the request (e.g., subdomain, header, URL parameter)
    const subdomain = req.headers['x-subdomain']; // Example: Using header 'x-subdomain' to identify the tenant

    if (subdomain) {
      // Fetch the tenant information from the database using Prisma
      const tenant = await this.prisma.tenant.findUnique({
        where: { subdomain: subdomain.toString() },
      });

      if (!tenant) {
        throw new NotFoundException('Tenant not found.');
      }

      // Set the tenant's database connection information in the request object
      req['tenant'] = tenant;
    }

    next();
  }
}
