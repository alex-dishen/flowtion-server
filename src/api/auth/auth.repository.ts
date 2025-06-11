import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthRepository {
  constructor(private redisService: RedisService) {}

  getUserSessionById(tokenKey: string): Promise<string | null> {
    return this.redisService.get(tokenKey);
  }

  async createOrUpdateUserSession(tokenKey: string, hashedToken: string, expiresInSeconds: number): Promise<void> {
    await this.redisService.set(tokenKey, hashedToken, expiresInSeconds);
  }

  async deleteUserSession(tokenKey: string): Promise<void> {
    await this.redisService.del(tokenKey);
  }
}
