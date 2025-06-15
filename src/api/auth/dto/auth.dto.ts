import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsString } from 'class-validator';

export class SingInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class AuthDto {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class AccessTokenDto extends OmitType(AuthDto, ['refresh_token']) {}
