// Auto-generated CRUD types for Kysely
// Generated at 2025-06-14T16:05:36.840Z

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

export type TenantDB = {
  users: UserTable;
};
