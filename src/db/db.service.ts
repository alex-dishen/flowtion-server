import { PublicDB } from './types/public-db.types';
import { TenantDB } from './types/tenant-db.types';
import { Kysely, SelectQueryBuilder } from 'kysely';
import { TenantContext } from './tenant-services/tenant.context';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginatedResult, PaginateOptions, PaginationMetadata } from 'src/shared/dtos/pagination.dto';
import { DatabaseConnectionService } from './db-connection.service';

@Injectable()
export class DatabaseService {
  public readonly db: Kysely<unknown>;
  public readonly publicDb: Kysely<PublicDB>;
  public readonly tenantDb: Kysely<TenantDB>;

  constructor(
    private tenantContext: TenantContext,
    private dbConnection: DatabaseConnectionService,
  ) {
    this.db = this.dbConnection.connection;
    this.publicDb = this.dbConnection.connection.withSchema('public') as Kysely<PublicDB>;

    // With simple assignment, the schema would be evaluated ONCE during service initialization
    // This way (with getter) it is evaluated on each request
    Object.defineProperty(this, 'tenantDb', {
      get: () => {
        const schema = this.tenantContext.getSchema();

        if (!schema) {
          throw new Error('Tenant schema not set');
        }

        return this.dbConnection.connection.withSchema(schema);
      },
    });
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
