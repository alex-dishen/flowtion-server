import { hash } from 'argon2';
import { randomBytes } from 'crypto';
import { TenantRepository } from './tenant.repository';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { CreateTenantDto, TenantDto } from './dto/tenant.dto';
import { TenantMigrator } from 'src/db/tenant-services/tenant-migrator';
import { AppConfigService } from 'src/shared/services/config-service/config.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  constructor(
    private config: AppConfigService,
    private tenantMigrator: TenantMigrator,
    private tenantRepository: TenantRepository,
  ) {}

  private async generateApiKey() {
    const apiKey = randomBytes(32).toString('hex');
    const hashedApiKey = await hash(apiKey);

    return { apiKey, hashedApiKey };
  }

  async createTenant(data: CreateTenantDto): Promise<TenantDto> {
    const dbUrl = this.config.get('DATABASE_URL');
    const migrationResult = await this.tenantMigrator.migrateSchema(dbUrl, data.schema_name);

    if (!migrationResult.success) {
      const errorMsg = migrationResult.errors[0] || 'Failed to create tenant schema';
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    const { apiKey, hashedApiKey } = await this.generateApiKey();

    const tenant = await this.tenantRepository.createTenant({
      ...data,
      api_key: hashedApiKey,
    });

    return { ...tenant, api_key: apiKey };
  }

  getAllTenants(): Promise<TenantDto[]> {
    return this.tenantRepository.getAllTenants();
  }

  async addUserToTenant(tenantId: string, userId: string): Promise<MessageDto> {
    await this.tenantRepository.addUserToTenant(tenantId, userId);

    return { message: 'Successfully added user to the tenant' };
  }
}
