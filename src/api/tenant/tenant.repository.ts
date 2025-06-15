import { Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { PublicDB, TenantCreateInput, TenantGetOutput } from 'src/db/types/public-db.types';
import { TenantDB } from 'src/db/types/tenant-db.types';

@Injectable()
export class TenantRepository {
  constructor(private kysely: DatabaseService) {}

  async createTenant(data: TenantCreateInput): Promise<TenantGetOutput> {
    return this.kysely.publicDb
      .insertInto('tenants')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getAllTenants(): Promise<TenantGetOutput[]> {
    return this.kysely.publicDb.selectFrom('tenants').selectAll().execute();
  }

  addUserToTenant(tenantId: string, userId: string): Promise<void> {
    return this.kysely.db.transaction().execute(async trx => {
      const publicTrx = trx.withSchema('public') as unknown as Kysely<PublicDB>;

      const publicUser = await publicTrx
        .selectFrom('users')
        .where('id', '=', userId)
        .select(['id', 'first_name', 'last_name', 'email'])
        .executeTakeFirstOrThrow(() => new NotFoundException());

      const tenant = await publicTrx
        .selectFrom('tenants')
        .where('id', '=', tenantId)
        .select('schema_name')
        .executeTakeFirstOrThrow(() => new NotFoundException());

      await (trx.withSchema(tenant.schema_name) as unknown as Kysely<TenantDB>)
        .insertInto('users')
        .values({
          id: publicUser.id,
          email: publicUser.email,
          first_name: publicUser.first_name,
          last_name: publicUser.first_name,
        })
        .execute();

      await publicTrx.insertInto('user_tenant_relations').values({ tenant_id: tenantId, user_id: userId }).execute();
    });
  }
}
