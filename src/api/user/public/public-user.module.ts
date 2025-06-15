import { Module } from '@nestjs/common';
import { PublicUserController } from './public-user.controller';
import { PublicUserRepository } from './public-user.repository';
import { PublicUserService } from './public-user.service';

@Module({
  imports: [],
  controllers: [PublicUserController],
  providers: [PublicUserRepository, PublicUserService],
  exports: [PublicUserRepository],
})
export class PublicUserModule {}
