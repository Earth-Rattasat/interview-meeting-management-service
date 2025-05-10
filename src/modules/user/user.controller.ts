import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { SingleResponseDto } from 'src/utils/base-response-dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() payload: CreateUserDto,
  ): Promise<SingleResponseDto<User>> {
    const data = await this.userService.createUser(payload);
    return { data };
  }
}
