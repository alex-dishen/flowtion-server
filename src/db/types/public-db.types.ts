// Auto-generated CRUD types for Kysely
// Generated at 2025-06-14T16:05:35.735Z

import type { ColumnType, Generated, Selectable, Insertable, Updateable } from 'kysely';

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

export type UserTable = {
  id: Generated<string>;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
  is_deleted: Generated<boolean>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  deleted_by: string | null;
  status: Generated<UserStatus>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type TenantTable = {
  id: Generated<string>;
  name: string;
  schema_name: string;
  subdomain: string;
  logo_url: string | null;
  api_key: string;
  is_active: Generated<boolean>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type TenantGetOutput = Selectable<TenantTable>;
export type TenantCreateInput = Insertable<TenantTable>;
export type TenantUpdateInput = Updateable<TenantTable>;

export type UserTenantRelationTable = {
  id: Generated<string>;
  tenant_id: string;
  user_id: string;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
};
export type UserTenantRelationGetOutput = Selectable<UserTenantRelationTable>;
export type UserTenantRelationCreateInput = Insertable<UserTenantRelationTable>;
export type UserTenantRelationUpdateInput = Updateable<UserTenantRelationTable>;

export type PublicDB = {
  users: UserTable;
  tenants: TenantTable;
  user_tenant_relations: UserTenantRelationTable;
};
