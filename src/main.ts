import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'prod';

  const app = await NestFactory.create(AppModule);

  if (!isProduction) {
    const config = new DocumentBuilder().setTitle('Flowtion API').setVersion('1.0').build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
