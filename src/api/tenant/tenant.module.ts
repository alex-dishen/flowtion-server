import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantRepository } from './tenant.repository';
import { TenantService } from './tenant.service';
import { TenantMigrator } from 'src/db/tenant-services/tenant-migrator';

@Module({
  controllers: [TenantController],
  providers: [TenantRepository, TenantService, TenantMigrator],
})
export class TenantModule {}
