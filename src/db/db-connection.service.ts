import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

{
  /* 
    The DatabaseConnectionServices lives separately from the DatabaseService
    to avoid creating a new connection for each tenant and reuse the same connection for all of them.
    
    DatabaseService depends on TenantContext which is request-scoped and marked as durable,
    which means there will be as many DatabaseService instances as tenants in the system.
*/
}
@Injectable()
export class DatabaseConnectionService implements OnModuleDestroy {
  public readonly connection: Kysely<unknown>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.connection = new Kysely({
      dialect: new PostgresDialect({ pool }),
    });
  }

  async onModuleDestroy() {
    await this.connection.destroy();
  }
}
