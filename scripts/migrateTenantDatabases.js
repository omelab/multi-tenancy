// scripts/migrateTenantDatabases.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function migrateTenantDatabases() {
  const tenants = await prisma.tenant.findMany();

  for (const tenant of tenants) {
    // Set the environment variable for DATABASE_URL based on tenant's database configuration
    process.env.DATABASE_URL = `postgresql://${tenant.dbUsername}:${tenant.dbPassword}@${tenant.dbHost}:${tenant.dbPort}/${tenant.dbName}`;

    // Run migrations for the tenant's database
    await prisma.$executeRaw('npx prisma migrate dev');
  }

  await prisma.$disconnect();
}

migrateTenantDatabases().catch((e) => {
  console.error(e);
  process.exit(1);
});
