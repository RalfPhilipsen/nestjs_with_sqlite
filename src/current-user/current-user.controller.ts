import { Controller, Get, Patch, UseGuards, Request, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('Current User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('current_user')
export class CurrentUserController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * TODO: Return current user
   */

  @Get()
  async show(@CurrentUser() user: User): Promise<User> {
    return user
  }

  /*
   * TODO: Update current user
   */

  @Patch()
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto)
  }
}
