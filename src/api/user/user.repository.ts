import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import { UserCreateInput } from 'src/db/db.types';

@Injectable()
export class UserRepository {
  constructor(public kysely: DatabaseService) {}

  async createUser(data: UserCreateInput) {
    return this.kysely.db.insertInto('user').values(data).execute();
  }
}
