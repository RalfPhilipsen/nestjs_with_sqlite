import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { User } from './entities/user.entity';
import { mainConfig } from '../main.config';
import { AuthService } from '../auth/auth.service';

const USER_USERNAME = 'username';
const USER_PASSWORD = 'password';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const authService = module.get<AuthService>(AuthService);

    user = await authService.signUp({
      username: USER_USERNAME,
      password: USER_PASSWORD,
    });

    const tokenResponse = await authService.generateToken({ username: USER_USERNAME, password: USER_PASSWORD });
    token = `Bearer ${tokenResponse.accessToken}`;
    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('returns a 200 response with an array of users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set({ Authorization: token })
        .then(({ statusCode }) => {
          expect(statusCode).toBe(200);
        });
    });
  });

  describe('GET /users/{id}', () => {
    describe('when user with id exists', () => {
      it('returns a 200 response with a user', () => {
        return request(app.getHttpServer())
          .get(`/users/${user.id}`)
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('when user with id does not exist', () => {
      it('returns a 404 response', () => {
        return request(app.getHttpServer())
          .get(`/users/1234`)
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(404);
          });
      });
    });
  });
});
