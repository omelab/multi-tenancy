import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port: number = configService.get<number>('PORT');

  app.setGlobalPrefix('api');

  app.use(helmet());

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({
      allowedHeaders: '*',
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('APP_NAME'))
      .setDescription(configService.get<string>('APP_DESCRIPTION'))
      .setVersion(configService.get<string>('APP_VERSION'))
      .addBearerAuth()
      .build();

    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: configService.get<string>('APP_DESCRIPTION'),
    };

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document, customOptions);
  } else {
    const whitelist = [configService.get<string>('FRONTEND_URL')];
    app.enableCors({
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });
  }

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());
  await app.listen(port);

  console.log('string: http://localhost:' + port);
}
bootstrap();
