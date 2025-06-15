import { Injectable } from '@nestjs/common';
import { CreateTenantUserDto, TenantUpdateUserDto, TenantUserDto } from './dto/tenant-user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { hash } from 'argon2';
import { TenantUserRepository } from './tenant-user.repository';

@Injectable()
export class TenantUserService {
  constructor(private tenantUserRepository: TenantUserRepository) {}

  async createTenantUser(data: CreateTenantUserDto): Promise<TenantUserDto> {
    const hashedPassword = await hash(data.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmation_password, ...updatedData } = { ...data, password: hashedPassword };

    return this.tenantUserRepository.createTenantUser(updatedData);
  }

  getTenantUser(userId: string): Promise<TenantUserDto> {
    return this.tenantUserRepository.getTenantUserBy({ id: userId });
  }

  getTenantAllUsers({ skip, take }: PaginationDto): Promise<PaginatedResult<TenantUserDto>> {
    return this.tenantUserRepository.getTenantUsersAll({ take, skip });
  }

  async updateTenantUser(userId: string, data: Partial<TenantUpdateUserDto>): Promise<MessageDto> {
    await this.tenantUserRepository.updateTenantUser(userId, data);

    return { message: 'Successfully updated a user' };
  }

  async deleteTenantUser(userId: string): Promise<MessageDto> {
    await this.tenantUserRepository.deleteTenantUser(userId);

    return { message: 'Successfully deleted a user' };
  }
}
