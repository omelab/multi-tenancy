import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
const prisma = new PrismaClient();

interface MigrateTenantDatabasesFn {
  (tenantId: number): Promise<void>;
}

export const migrateTenantDatabases: MigrateTenantDatabasesFn = async (
  tenantId,
) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error(`Tenant with ID ${tenantId} not found.`);
    }

    // Example query to create the new tenant's database
    prisma.$executeRawUnsafe(`
      CREATE DATABASE "${tenant.dbName}"
      WITH OWNER "${tenant.dbUsername}"
      ENCODING 'UTF8'
      LC_COLLATE = 'en_US.UTF-8'
      LC_CTYPE = 'en_US.UTF-8'
      TEMPLATE template0;
    `);

    // Set the environment variable for DATABASE_URL based on the tenant's database configuration
    process.env.DATABASE_URL = `postgresql://${tenant.dbUsername}:${tenant.dbPassword}@${tenant.dbHost}:${tenant.dbPort}/${tenant.dbName}`;

    // Generate migration script for the specific models
    execSync(`npx prisma migrate dev --preview-feature ${tenant.name}`, {
      stdio: 'inherit',
    });

    console.log(
      `Migrations completed for tenant with ID: ${tenantId} and models: ${tenant.name}`,
    );
  } catch (error) {
    console.error(
      `Error running migrations for tenant with ID ${tenantId}:`,
      error.message,
    );
    throw error;
  }
};

module.exports = { migrateTenantDatabases };
