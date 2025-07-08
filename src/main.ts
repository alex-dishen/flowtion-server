import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TenantMigrator } from './db/tenant-services/tenant-migrator';
import { AggregateByTenantContextIdStrategy } from './db/tenant-services/tenant-context.strategy';
import { AppConfigService } from './shared/services/config-service/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<AppConfigService>(AppConfigService);

  const nodeEnv = config.get('NODE_ENV');

  if (nodeEnv !== 'prod') {
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

  app.use(cookieParser(config.get('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());

  if (nodeEnv !== 'local' || config.get('MIGRATE_TENANTS') === true) {
    const tenantMigrator = app.get<TenantMigrator>(TenantMigrator);
    await tenantMigrator.migrateAll();
  }

  await app.listen(config.get('PORT'));
}

bootstrap();
