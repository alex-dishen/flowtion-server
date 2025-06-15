import { TenantService } from './tenant.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AddTenantUserDto, CreateTenantDto, TenantDto } from './dto/tenant.dto';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @ApiOperation({ summary: 'Create a new company' })
  @Post()
  createCompany(@Body() data: CreateTenantDto): Promise<TenantDto> {
    return this.tenantService.createTenant(data);
  }

  @ApiOperation({ summary: 'Get all companies' })
  @Get()
  getAllTenants(): Promise<TenantDto[]> {
    return this.tenantService.getAllTenants();
  }

  @ApiOperation({ summary: 'Add a user to a company' })
  @Post('/:id/users')
  addUserToTenant(@Param('id') id: string, @Body() data: AddTenantUserDto): Promise<MessageDto> {
    return this.tenantService.addUserToTenant(id, data.user_id);
  }
}
