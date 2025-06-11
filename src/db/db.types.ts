// Auto-generated CRUD types for Kysely
// Generated at 2025-06-11T06:04:59.430Z

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
  avatar_image_url: string | null;
  avatar_image_bucket_key: string | null;
  is_soft_deleted: Generated<boolean>;
  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
  deleted_at: ColumnType<Date, Date | string | undefined, Date | string>;
  status: Generated<UserStatus>;
  deleted_by: string | null;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type DB = {
  users: UserTable;
};
