import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: UserDto): Promise<MessageDto> {
    await this.userRepository.createUser(data);

    return { message: 'User created successfully' };
  }
}
