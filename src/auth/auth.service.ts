import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { TokenDto } from './dto/token.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && compareSync(password, user.encryptedPassword)) {
      return user;
    }

    return null;
  }

  signUp({ username, password }: AuthDto) {
    const encryptedPassword = hashSync(password, SALT_ROUNDS);

    return this.usersService.create({ username, encryptedPassword });
  }

  async login(authDto: AuthDto): Promise<TokenDto> {
    const user = await this.validateUser(authDto.username, authDto.password);
    const payload = { username: user.username, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
