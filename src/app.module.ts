import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './api/auth/auth.module';
import { TenantModule } from './api/tenant/tenant.module';
import { PublicUserModule } from './api/user/public/public-user.module';
import { TenantUserModule } from './api/user/tenant/tenant-user.module';
import { AppConfigModule } from './shared/services/config-service/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    TenantModule,
    AuthModule,
    PublicUserModule,
    TenantUserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
