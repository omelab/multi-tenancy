import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TenantMiddleware } from './shared/middlewares/tenant.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TenantModule } from './modules/tenants/tenant.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'public'),
      exclude: ['/api*'],
    }),
    PrismaModule,
    TenantModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClient],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
