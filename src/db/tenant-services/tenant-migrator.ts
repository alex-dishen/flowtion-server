/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db.service';
import { spawnProcess, SpawnProcessResult } from 'src/shared/helpers/spawn-process';
import { AppConfigService } from 'src/shared/services/config-service/config.service';

type MigrateSchemaResult = { success: boolean; schema: string } & SpawnProcessResult;

@Injectable()
export class TenantMigrator {
  constructor(
    private kysely: DatabaseService,
    private config: AppConfigService,
  ) {}

  async migrateSchema(baseDbUrl: string, schemaName: string): Promise<MigrateSchemaResult> {
    try {
      // DATABASE_URL is changed to the tenant database URL to make sure Prisma picks the right schema from connection string
      // Later we change it back to the base database URL
      const tenantDBUrl = `${baseDbUrl}?schema=${schemaName}`;
      this.config.set('DATABASE_URL', tenantDBUrl);

      // Prisma CREATES the schema under the hood if it does not exist and then applies migrations
      const result = await spawnProcess('npx', ['prisma', 'migrate', 'deploy', '--schema', 'prisma/tenant/tenant.prisma']);

      console.log(`Successfully migrated ${schemaName} schema`);

      this.config.set('DATABASE_URL', baseDbUrl);

      return {
        success: true,
        schema: schemaName,
        data: result.data,
        errors: result.errors,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error migrating ${schemaName} schema`, errorMessage);

      return {
        success: false,
        schema: schemaName,
        data: 'Error migrating schema',
        errors: [errorMessage],
      };
    }
  }

  async migrateAll(): Promise<void> {
    try {
      const tenants = await this.kysely.publicDb.selectFrom('tenants').select('schema_name').execute();

      console.log('Starting migrating tenants...');

      const baseDBUrl = this.config.get('DATABASE_URL');

      const responses = [];
      for (const tenant of tenants) {
        const result = await this.migrateSchema(baseDBUrl, tenant.schema_name);
        responses.push(result);
      }

      const successfulResponses = responses.filter(response => response.success);
      const failedResponses = responses.filter(response => !response.success);

      console.log(`Tenants migration finished. Success: ${successfulResponses.length}. Failed: ${failedResponses.length}`, {
        successfulResponses: successfulResponses.map(response => ({ success: response.schema, schema: response.schema })),
        failedResponses,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      console.error('Error creating new tenant', {
        error: err.message,
        stack: err.stack,
      });
    }
  }
}
