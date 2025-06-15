import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, IsUUID, MinLength } from 'class-validator';
import { UserStatus } from 'src/db/types/tenant-db.types';
import { Match } from 'src/shared/decorators/match.decorator';

export class TenantUserDto {
  @IsUUID()
  id: string;
  first_name: string;
  last_name: string;

  @IsEmail()
  email: string;
  created_at: Date;
  updated_at: Date | null;
  is_deleted: boolean;
  deleted_at: Date | null;
  deleted_by: string | null;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.Active;
}

export class CreateTenantUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match<CreateTenantUserDto>('password', { message: 'Passwords do not match' })
  confirmation_password: string;

  @IsEmail()
  email: string;
}

export class TenantUpdateUserDto {
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

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.Active;
}
