import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { UserStatus } from 'src/db/db.types';

export class UserDto {
  @IsUUID()
  id: string;

  @IsString()
  @Type(() => String)
  @MinLength(1)
  first_name: string;

  @IsString()
  @Type(() => String)
  @MinLength(1)
  last_name: string;

  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  password: string;

  @IsString()
  avatar_image_url: string | null;

  @IsString()
  avatar_image_bucket_key: string | null;

  @IsBoolean()
  is_soft_deleted: boolean;

  @IsString()
  created_at: Date;

  @IsString()
  deleted_at: Date | null;

  @IsString()
  deleted_by: string | null;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.Active;
}
