import { Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DatabaseService } from 'src/db/db.service';
import { PublicDB, UserCreateInput, UserGetOutput, UserUpdateInput } from 'src/db/types/public-db.types';
import { TenantDB } from 'src/db/types/tenant-db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class PublicUserRepository {
  constructor(private kysely: DatabaseService) {}

  async createPublicUser(data: UserCreateInput): Promise<UserGetOutput> {
    return this.kysely.publicDb
      .insertInto('users')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  async getPublicUserBy(where: Partial<UserGetOutput>): Promise<UserGetOutput> {
    let qb = this.kysely.publicDb.selectFrom('users');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof UserGetOutput, '=', value);
    }

    return qb.selectAll().executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getPublicUsersAll({ skip, take }: PaginateOptions): Promise<PaginatedResult<UserGetOutput>> {
    const qb = this.kysely.publicDb.selectFrom('users').selectAll();

    return this.kysely.paginate(qb, { take, skip });
  }

  async updatePublicUser(userId: string, data: UserUpdateInput): Promise<void> {
    await this.kysely.publicDb.updateTable('users').set(data).where('id', '=', userId).execute();
  }

  async deletePublicUser(userId: string): Promise<void> {
    // Public user can exist without a tenant user, but tenant user can't exist without a public user
    return this.kysely.db.transaction().execute(async trx => {
      const publicDB = trx.withSchema('public') as unknown as Kysely<PublicDB>;

      const tenants = await publicDB.selectFrom('tenants').select('schema_name').execute();

      for (const tenant of tenants) {
        await (trx.withSchema(tenant.schema_name) as unknown as Kysely<TenantDB>)
          .deleteFrom('users')
          .where('id', '=', userId)
          .execute();
      }

      await publicDB.deleteFrom('users').where('id', '=', userId).execute();
    });
  }
}
