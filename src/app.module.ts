import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, RedisModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
