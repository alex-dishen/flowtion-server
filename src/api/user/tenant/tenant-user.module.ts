import { Module } from '@nestjs/common';
import { TenantUserController } from './tenant-user.controller';
import { TenantUserRepository } from './tenant-user.repository';
import { TenantUserService } from './tenant-user.service';

@Module({
  imports: [],
  controllers: [TenantUserController],
  providers: [TenantUserRepository, TenantUserService],
  exports: [],
})
export class TenantUserModule {}
