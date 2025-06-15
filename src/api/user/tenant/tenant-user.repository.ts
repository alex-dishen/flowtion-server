import { Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { TenantContext } from 'src/db/tenant-services/tenant.context';
import { PublicDB, UserCreateInput as PublicUserCreateInput } from 'src/db/types/public-db.types';
import { TenantDB, UserGetOutput, UserUpdateInput } from 'src/db/types/tenant-db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class TenantUserRepository {
  constructor(
    private kysely: DatabaseService,
    private tenantContext: TenantContext,
  ) {}

  async createTenantUser(data: PublicUserCreateInput): Promise<UserGetOutput> {
    const tenantId = this.tenantContext.getTenantId();
    const schemaName = this.tenantContext.getSchema();

    // Public user can exist without a tenant user, but tenant user can't exist without a public user
    return this.kysely.db.transaction().execute(async trx => {
      const publicTrx = trx.withSchema('public') as unknown as Kysely<PublicDB>;

      const publicUser = await publicTrx
        .insertInto('users')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow(() => new NotFoundException());

      await publicTrx.insertInto('user_tenant_relations').values({ user_id: publicUser.id, tenant_id: tenantId }).execute();

      return (trx.withSchema(schemaName) as unknown as Kysely<TenantDB>)
        .insertInto('users')
        .values({
          id: publicUser.id,
          email: publicUser.email,
          first_name: publicUser.first_name,
          last_name: publicUser.last_name,
          created_at: publicUser.created_at,
        })
        .returningAll()
        .executeTakeFirstOrThrow(() => new NotFoundException());
    });
  }

  async getTenantUserBy(where: Partial<UserGetOutput>): Promise<UserGetOutput> {
    let qb = this.kysely.tenantDb.selectFrom('users');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof UserGetOutput, '=', value);
    }

    return qb.selectAll().executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getTenantUsersAll({ skip, take }: PaginateOptions): Promise<PaginatedResult<UserGetOutput>> {
    const qb = this.kysely.tenantDb.selectFrom('users').selectAll();

    return this.kysely.paginate(qb, { take, skip });
  }

  async updateTenantUser(userId: string, data: UserUpdateInput): Promise<void> {
    await this.kysely.tenantDb.updateTable('users').set(data).where('id', '=', userId).execute();
  }

  async deleteTenantUser(userId: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    const tenantSchema = this.tenantContext.getSchema();

    return this.kysely.db.transaction().execute(async trx => {
      await (trx.withSchema('public') as unknown as Kysely<PublicDB>)
        .deleteFrom('user_tenant_relations')
        .where('user_id', '=', userId)
        .where('tenant_id', '=', tenantId)
        .execute();

      await (trx.withSchema(tenantSchema) as unknown as Kysely<TenantDB>).deleteFrom('users').where('id', '=', userId).execute();
    });
  }
}
