import { Controller, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  show(@Request() req) {
    return req.user
  }

  /*
   * TODO: Update current user
   */

  @Patch()
  update() {
    return 'Add your implementation here.';
  }
}
