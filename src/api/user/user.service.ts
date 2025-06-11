import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { hash } from 'argon2';
import { UserStatus } from 'src/db/db.types';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(userId: string): Promise<UserDto> {
    return this.userRepository.getBy({ id: userId });
  }

  async getAllUsers({ skip, take }: PaginationDto): Promise<PaginatedResult<UserDto>> {
    return this.userRepository.getAll({ take, skip });
  }

  async updateUser(userId: string, data: Partial<UpdateUserDto>): Promise<MessageDto> {
    let dataToUpdate = data;

    if (data.password) {
      const hashedPassword = await hash(data.password);
      dataToUpdate = { ...data, password: hashedPassword };
    }

    await this.userRepository.update(userId, dataToUpdate);

    return { message: 'Successfully updated a user' };
  }

  async deleteUser(userId: string): Promise<MessageDto> {
    await this.userRepository.delete(userId);

    return { message: 'Successfully deleted a user' };
  }

  async softDeleteUser(userToDeleteId: string, userDeletingId: string): Promise<MessageDto> {
    await this.userRepository.update(userToDeleteId, {
      is_soft_deleted: true,
      status: UserStatus.Inactive,
      deleted_at: new Date().toISOString(),
      deleted_by: userDeletingId,
    });

    return { message: 'Successfully soft deleted a user' };
  }
}
