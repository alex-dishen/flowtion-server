import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { EnvVariable } from './shared/types/env-variable.types';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'prod';

  const app = await NestFactory.create(AppModule);

  if (!isProduction) {
    const config = new DocumentBuilder().setTitle('Flowtion API').setVersion('1.0').addBearerAuth().build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.use(cookieParser(process.env[EnvVariable.COOKIE_SECRET]));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
