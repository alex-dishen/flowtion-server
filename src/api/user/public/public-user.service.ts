import { Injectable } from '@nestjs/common';
import { UpdatePublicUserDto, PublicUserDto, CreatePublicUserDto } from './dto/public-user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { hash } from 'argon2';
import { PublicUserRepository } from './public-user.repository';

@Injectable()
export class PublicUserService {
  constructor(private publicUserRepository: PublicUserRepository) {}

  async createPublicUser(data: CreatePublicUserDto): Promise<PublicUserDto> {
    const hashedPassword = await hash(data.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmation_password, ...updatedData } = { ...data, password: hashedPassword };

    return this.publicUserRepository.createPublicUser(updatedData);
  }

  async getPublicUser(userId: string): Promise<PublicUserDto> {
    return this.publicUserRepository.getPublicUserBy({ id: userId });
  }

  async getAllPublicUsers({ skip, take }: PaginationDto): Promise<PaginatedResult<PublicUserDto>> {
    return this.publicUserRepository.getPublicUsersAll({ take, skip });
  }

  async updatePublicUser(userId: string, data: Partial<UpdatePublicUserDto>): Promise<MessageDto> {
    let dataToUpdate = data;

    if (data.password) {
      const hashedPassword = await hash(data.password);
      dataToUpdate = { ...data, password: hashedPassword };
    }

    await this.publicUserRepository.updatePublicUser(userId, dataToUpdate);

    return { message: 'Successfully updated a user' };
  }

  async deletePublicUser(userId: string): Promise<MessageDto> {
    await this.publicUserRepository.deletePublicUser(userId);

    return { message: 'Successfully deleted a user' };
  }
}
