import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class TenantContext {
  private currentTenantId: string;
  private currentSchemaName: string;

  setTenantSpecifics(tenantId: string, schemaName: string) {
    this.currentTenantId = tenantId;
    this.currentSchemaName = schemaName;
  }

  getSchema(): string {
    return this.currentSchemaName;
  }

  getTenantId(): string {
    return this.currentTenantId;
  }
}
