import { DatabaseService } from './db.service';
import { Global, Module } from '@nestjs/common';
import { TenantContext } from './tenant-services/tenant.context';
import { DatabaseConnectionService } from './db-connection.service';

@Global()
@Module({
  providers: [DatabaseConnectionService, DatabaseService, TenantContext],
  exports: [DatabaseService, TenantContext],
})
export class DatabaseModule {}
