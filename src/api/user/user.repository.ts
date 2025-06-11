import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { UserCreateInput, UserGetOutput, UserUpdateInput } from 'src/db/db.types';
import { PaginatedResult, PaginateOptions } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class UserRepository {
  constructor(public kysely: DatabaseService) {}

  async create(data: UserCreateInput): Promise<UserGetOutput> {
    return this.kysely.db
      .insertInto('users')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow(() => new NotFoundException());
  }

  async getBy(where: Partial<UserGetOutput>): Promise<UserGetOutput> {
    let qb = this.kysely.db.selectFrom('users');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof UserGetOutput, '=', value);
    }

    return qb.selectAll().executeTakeFirstOrThrow(() => new NotFoundException());
  }

  getAll({ skip, take }: PaginateOptions): Promise<PaginatedResult<UserGetOutput>> {
    const qb = this.kysely.db.selectFrom('users').selectAll();

    return this.kysely.paginate(qb, { take, skip });
  }

  async update(userId: string, data: UserUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('users').set(data).where('id', '=', userId).execute();
  }

  async delete(userId: string): Promise<void> {
    await this.kysely.db.deleteFrom('users').where('id', '=', userId).execute();
  }
}
