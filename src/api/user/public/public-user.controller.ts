import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdatePublicUserDto, PublicUserDto, CreatePublicUserDto } from './dto/public-user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { IgnoreAuthGuard, JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { PublicUserService } from './public-user.service';

@ApiTags('Public Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/public')
export class PublicUserController {
  constructor(private publicUserService: PublicUserService) {}

  @ApiOperation({ summary: 'Get current user from public schema' })
  @Get('/current')
  getCurrentPublicUser(@GetUser('sub') userId: string): Promise<PublicUserDto> {
    return this.publicUserService.getPublicUser(userId);
  }

  @ApiOperation({ summary: 'Update current user in public schema' })
  @Put('/current')
  updateCurrentPublicUser(@GetUser('sub') userId: string, @Body() data: UpdatePublicUserDto): Promise<MessageDto> {
    return this.publicUserService.updatePublicUser(userId, data);
  }

  @ApiOperation({ summary: 'Delete current user from public schema' })
  @Delete('/current')
  deleteCurrentPublicUser(@GetUser('sub') userId: string): Promise<MessageDto> {
    return this.publicUserService.deletePublicUser(userId);
  }

  @ApiOperation({ summary: 'Create a user in public schema' })
  @IgnoreAuthGuard()
  @Post()
  createPublicUser(@Body() data: CreatePublicUserDto): Promise<PublicUserDto> {
    return this.publicUserService.createPublicUser(data);
  }

  @ApiOperation({ summary: 'Get all users from public schema' })
  @ApiPaginatedResponse(PublicUserDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get()
  getAllPublicUsers(@Query() pagination: PaginationDto): Promise<PaginatedResult<PublicUserDto>> {
    return this.publicUserService.getAllPublicUsers(pagination);
  }

  @ApiOperation({ summary: 'Get a user by id from public schema' })
  @Get('/:id')
  getPublicUserById(@Param('id') id: string): Promise<PublicUserDto> {
    return this.publicUserService.getPublicUser(id);
  }

  @ApiOperation({ summary: 'Update user information in public schema' })
  @Put('/:id')
  updatePublicUser(@Param('id') id: string, @Body() data: UpdatePublicUserDto): Promise<MessageDto> {
    return this.publicUserService.updatePublicUser(id, data);
  }

  @ApiOperation({ summary: 'Delete a user from public schema' })
  @Delete('/:id')
  deletePublicUser(@Param('id') id: string): Promise<MessageDto> {
    return this.publicUserService.deletePublicUser(id);
  }
}
