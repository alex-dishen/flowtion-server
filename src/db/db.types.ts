// Auto-generated CRUD types for Kysely
// Generated at 2025-05-27T06:14:51.696Z

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
  created_at: ColumnType<Date, Date | undefined, Date | string>;
  deleted_at: Date | null;
  deleted_by: string | null;
  status: Generated<UserStatus>;
};
export type UserGetOutput = Selectable<UserTable>;
export type UserCreateInput = Insertable<UserTable>;
export type UserUpdateInput = Updateable<UserTable>;

export type DB = {
  user: UserTable;
};
