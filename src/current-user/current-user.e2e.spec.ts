import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../auth/auth.service';
import { mainConfig } from '../main.config';

const USER_USERNAME = 'username';
const USER_PASSWORD = 'password';

describe('CurrentUserController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const authService = module.get<AuthService>(AuthService);

    await authService.signUp({
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

  describe('GET /current_user', () => {
    describe('with valid credentials', () => {
      it('should return a 200 response with the user', () => {
        return request(app.getHttpServer())
          .get('/current_user')
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('with invalid credentials', () => {
      it('should return a 401 response with an error', () => {
        return request(app.getHttpServer())
          .get('/current_user')
          .set({ Authorization: 'Bearer somefaultytoken' })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
          });
      });
    });
  });
});
