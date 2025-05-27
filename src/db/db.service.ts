import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './db.types';
import { ConfigService } from '@nestjs/config';

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
}
