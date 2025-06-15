import {
  HttpStatus,
  Injectable,
  CanActivate,
  SetMetadata,
  HttpException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Kysely } from 'kysely';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from 'src/db/db.service';
import { JwtPayloadT } from 'src/api/auth/types/types';
import { TenantDB, UserStatus } from 'src/db/types/tenant-db.types';
import { TenantContext } from 'src/db/tenant-services/tenant.context';

export const IgnoreTenantGuard = () => SetMetadata('isTenantGuardIgnored', true);

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private kysely: DatabaseService,
    private tenantContext: TenantContext,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnoreTenantGuard = this.reflector.get<boolean>('isTenantGuardIgnored', context.getHandler());

    if (isIgnoreTenantGuard) return true;

    const request = context.switchToHttp().getRequest();
    const userId = (request['user'] as JwtPayloadT).sub;
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId || !userId) return false;

    try {
      const isUserRelatedToTenant = await this.checkIfUserRelatedToTenant(userId, tenantId);

      if (!isUserRelatedToTenant) return false;

      const tenant = await this.kysely.publicDb
        .selectFrom('tenants')
        .where('id', '=', tenantId)
        .select(['id', 'schema_name'])
        .executeTakeFirstOrThrow(() => new NotFoundException());

      const isTenantUserActive = await this.isTenantUserActive(userId, tenant.schema_name);

      if (!isTenantUserActive) {
        throw new HttpException('Your account has been deactivated', HttpStatus.FORBIDDEN);
      }

      this.tenantContext.setTenantSpecifics(tenant.id, tenant.schema_name);

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error', error);
      }

      return false;
    }
  }

  private async isTenantUserActive(userId: string, schemaName: string): Promise<boolean> {
    const userTenantData = await (this.kysely.db as Kysely<TenantDB>)
      .withSchema(schemaName)
      .selectFrom('users')
      .where('id', '=', userId)
      .select('status')
      .executeTakeFirstOrThrow(() => new NotFoundException());

    return userTenantData?.status === UserStatus.Active;
  }

  private async checkIfUserRelatedToTenant(userId: string, tenantId: string): Promise<boolean> {
    const result = await this.kysely.publicDb
      .selectFrom('user_tenant_relations')
      .where('user_id', '=', userId)
      .where('tenant_id', '=', tenantId)
      .select('id')
      .executeTakeFirst();

    return !!result;
  }
}
