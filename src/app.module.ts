import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
