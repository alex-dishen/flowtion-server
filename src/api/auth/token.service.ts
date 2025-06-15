import dayjs from 'dayjs';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { CreateTokensResponse, JwtPayloadT, JwtTokenDecode } from './types/types';
import { AppConfigService } from 'src/shared/services/config-service/config.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: AppConfigService,
  ) {}

  async createTokens(userId: string, sessionId: string): Promise<CreateTokensResponse> {
    const accessTokenPayLoad: JwtPayloadT = { sub: userId };
    const refreshTokenPayload: JwtPayloadT = { sub: sessionId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayLoad, {
        secret: this.config.get('ACCESS_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRY_TIME'),
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.config.get('REFRESH_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRY_TIME'),
      }),
    ]);

    const decodedRefreshToken = await this.jwtService.decode<Promise<JwtTokenDecode | undefined>>(refreshToken);
    const hashedRefreshToken = await hash(refreshToken);
    const refreshTokenKey = this.getRefreshTokenKey(userId, sessionId);

    const refreshTokenExpirationTime = decodedRefreshToken?.exp;

    if (!refreshTokenExpirationTime) {
      throw new Error('Invalid refresh token: missing expiration time');
    }
    const expirationTime = dayjs.unix(refreshTokenExpirationTime);

    const currentTime = dayjs();

    const expiresIn = expirationTime.diff(currentTime, 'second');

    return { accessToken, refreshToken, refreshExpiresIn: expiresIn, hashedRefreshToken, refreshTokenKey };
  }

  verifyRefreshToken(token: string): Promise<JwtPayloadT> {
    return this.jwtService.verifyAsync(token, {
      secret: this.config.get('REFRESH_SECRET'),
    });
  }

  decodeToken(token: string): Promise<JwtPayloadT> {
    return this.jwtService.decode<Promise<JwtPayloadT>>(token);
  }

  getRefreshTokenKey = (userId: string, sessionId: string): string => {
    return `refreshToken:${userId}:${sessionId}`;
  };
}
