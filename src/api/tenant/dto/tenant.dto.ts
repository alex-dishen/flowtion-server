import { IsString } from 'class-validator';

export class AddTenantUserDto {
  @IsString()
  user_id: string;
}

export class TenantDto {
  id: string;
  name: string;
  api_key: string;
  created_at: Date;
  subdomain: string;
  is_active: boolean;
  schema_name: string;
  logo_url: string | null;
}

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  subdomain: string;

  @IsString()
  schema_name: string;
}
