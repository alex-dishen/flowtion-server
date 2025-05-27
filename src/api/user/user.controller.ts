import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async createUser(@Body() body: UserDto): Promise<MessageDto> {
    return this.userService.createUser(body);
  }
}
