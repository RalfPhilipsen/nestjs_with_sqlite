import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('generate_token')
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenDto })
  async login(@Body() authDto: AuthDto): Promise<TokenDto> {
    return this.authService.generateToken(authDto);
  }

  @Post('sign_in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  signIn(@Body() _authDto: AuthDto, @CurrentUser() user) {
    return user;
  }

  @Post('sign_up')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }
}
