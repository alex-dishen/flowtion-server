import {
  IsEnum,
  IsUUID,
  IsEmail,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { UserStatus } from 'src/db/types/tenant-db.types';
import { Match } from 'src/shared/decorators/match.decorator';
import { CreateTenantUserDto } from '../../tenant/dto/tenant-user.dto';

export class PublicUserDto {
  @IsUUID()
  id: string;
  first_name: string;
  last_name: string;

  @IsEmail()
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date | null;
  is_deleted: boolean;
  deleted_at: Date | null;
  deleted_by: string | null;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.Active;
}

export class CreatePublicUserDto {
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

export class UpdatePublicUserDto {
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

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.Active;
}
