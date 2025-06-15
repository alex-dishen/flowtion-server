import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTenantUserDto, TenantUpdateUserDto, TenantUserDto } from './dto/tenant-user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { TenantGuard } from 'src/shared/guards/tenant.guard';
import { TenantUserService } from './tenant-user.service';

@ApiTags('Tenant Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('users/tenant')
export class TenantUserController {
  constructor(private tenantUserService: TenantUserService) {}

  @ApiOperation({ summary: 'Get current user from tenant schema' })
  @Get('/current')
  getCurrentTenantUser(@GetUser('sub') userId: string): Promise<TenantUserDto> {
    return this.tenantUserService.getTenantUser(userId);
  }

  @ApiOperation({ summary: 'Update current user in tenant schema' })
  @Put('/current')
  updateCurrentTenantUser(@GetUser('sub') userId: string, @Body() data: TenantUpdateUserDto) {
    return this.tenantUserService.updateTenantUser(userId, data);
  }

  @ApiOperation({ summary: 'Delete current user in tenant schema' })
  @Delete('/current')
  deleteCurrentTenantUser(@GetUser('sub') userId: string): Promise<MessageDto> {
    return this.tenantUserService.deleteTenantUser(userId);
  }

  @ApiOperation({ summary: 'Create a user in tenant and public schemas' })
  @Post()
  createTenantUser(@Body() data: CreateTenantUserDto): Promise<TenantUserDto> {
    return this.tenantUserService.createTenantUser(data);
  }

  @ApiOperation({ summary: 'Get all users from tenant schema' })
  @ApiPaginatedResponse(TenantUserDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get()
  getTenantAllUsers(@Query() pagination: PaginationDto): Promise<PaginatedResult<TenantUserDto>> {
    return this.tenantUserService.getTenantAllUsers(pagination);
  }

  @ApiOperation({ summary: 'Get a user by id from tenant schema' })
  @Get('/:id')
  getTenantUserById(@Param('id') id: string): Promise<TenantUserDto> {
    return this.tenantUserService.getTenantUser(id);
  }

  @ApiOperation({ summary: 'Update user information in tenant schema' })
  @Put('/:id')
  updateTenantUser(@Param('id') id: string, @Body() data: TenantUpdateUserDto): Promise<MessageDto> {
    return this.tenantUserService.updateTenantUser(id, data);
  }

  @ApiOperation({ summary: 'Delete a user in tenant schema' })
  @Delete('/:id')
  deleteTenantUser(@Param('id') id: string): Promise<MessageDto> {
    return this.tenantUserService.deleteTenantUser(id);
  }
}
