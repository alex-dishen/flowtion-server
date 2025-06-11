import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from 'src/db/db.types';

export class UserDto {
  @IsUUID()
  id: string;
  first_name: string;
  last_name: string;

  @IsEmail()
  email: string;
  password: string;
  avatar_image_url: string | null;
  avatar_image_bucket_key: string | null;
  is_soft_deleted: boolean;
  created_at: Date;
  deleted_at: Date | null;
  deleted_by: string | null;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.Active;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  first_name?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  last_name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatar_image_url?: string | null;

  @IsString()
  @IsOptional()
  avatar_image_bucket_key?: string | null;

  @IsBoolean()
  @IsOptional()
  is_soft_deleted?: boolean;

  @IsString()
  @IsOptional()
  created_at?: Date;

  @IsString()
  @IsOptional()
  deleted_at?: Date;

  @IsString()
  @IsOptional()
  deleted_by?: string | null;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.Active;
}
