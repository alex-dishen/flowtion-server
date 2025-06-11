import { Injectable, InternalServerErrorException, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect, SelectQueryBuilder } from 'kysely';
import { Pool } from 'pg';
import { DB } from './db.types';
import { ConfigService } from '@nestjs/config';
import { PaginatedResult, PaginateOptions, PaginationMetadata } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public readonly db: Kysely<DB>;
  public readonly publicDb: Kysely<DB>;

  constructor(configService: ConfigService) {
    const pool = new Pool({ connectionString: configService.get('DATABASE_URL') });

    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({ pool }),
    });

    this.publicDb = this.db.withSchema('public');
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }

  private generateMeta = (take: number, skip: number, total: number): PaginationMetadata => {
    const lastPage = Math.ceil(total / take);
    const currentPage = skip === 0 ? 1 : Math.round(skip / take) + 1;

    const meta = {
      total,
      lastPage,
      currentPage,
      perPage: take,
      prev: currentPage > 1 ? currentPage * take - take : null,
      next: currentPage < lastPage ? currentPage * take : null,
    };

    return meta;
  };

  async paginate<DB, TB extends keyof DB, O = Record<string, unknown>>(
    qb: SelectQueryBuilder<DB, TB, O>,
    { skip = 0, take = 20 }: PaginateOptions,
  ): Promise<PaginatedResult<O>> {
    const [count, data] = await Promise.all([
      qb
        .clearSelect()
        .select(eb => eb.fn.countAll<string>().as('total'))
        .executeTakeFirst(),
      qb.limit(take).offset(skip).execute(),
    ]);

    if (!count) {
      throw new InternalServerErrorException('Failed to retrieve total count from database');
    }

    const meta = this.generateMeta(take, skip, 'total' in count ? Number(count.total) : 0);

    return { data, meta };
  }
}
