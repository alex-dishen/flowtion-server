import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthCookieService } from './auth-cookie.service';
import { PublicUserModule } from '../user/public/public-user.module';

@Module({
  imports: [PublicUserModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, AuthCookieService, TokenService],
})
export class AuthModule {}
