import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvVariableEnum } from './shared/types/env-variable.types';
import { TenantMigrator } from './db/tenant-services/tenant-migrator';
import { AggregateByTenantContextIdStrategy } from './db/tenant-services/tenant-context.strategy';

async function bootstrap() {
  const nodeEnv = process.env[EnvVariableEnum.NODE_ENV];
  const PORT = process.env[EnvVariableEnum.PORT] || 3001;
  const isProduction = nodeEnv === 'prod';

  const app = await NestFactory.create(AppModule);

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Flowtion API')
      .setVersion('1.0')
      .addBearerAuth()
      .addGlobalParameters({
        name: 'x-tenant-id',
        in: 'header',
        description: 'Tenant id (uuid v4)',
        required: false,
        schema: {
          type: 'string',
          format: 'uuid',
        },
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  app.use(cookieParser(process.env[EnvVariableEnum.COOKIE_SECRET]));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  if (nodeEnv !== 'local' || process.env[EnvVariableEnum.MIGRATE_TENANTS] === 'true') {
    const tenantMigrator = app.get<TenantMigrator>(TenantMigrator);
    await tenantMigrator.migrateAll();
  }

  await app.listen(PORT);
}

bootstrap();
