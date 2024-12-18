import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { mainConfig } from '../main.config';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { AuthService } from '../auth/auth.service';

const USER_USERNAME = 'username';
const USER_PASSWORD = 'password';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let product: Product;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    const productService = module.get<ProductsService>(ProductsService);
    const authService = module.get<AuthService>(AuthService);
    
    await authService.signUp({
      username: USER_USERNAME,
      password: USER_PASSWORD,
    });

    const tokenResponse = await authService.generateToken({ username: USER_USERNAME, password: USER_PASSWORD });
    token = `Bearer ${tokenResponse.accessToken}`;

    product = await productService.create({
      name: 'Test Product',
      description: 'Description for Test Product.',
      priceSubunit: 1_000,
      priceCurrency: 'GBP',
    });

    mainConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products?name=Test Product&price_subunit[gte]=0&price_subunit[lte]=10001', () => {
    it('returns a 200 response with an array of products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .set({ Authorization: token })
        .then(({ statusCode }) => {
          expect(statusCode).toBe(200);
        });
    });
  });

  describe('GET /products/{id}', () => {
    describe('when product with id exists', () => {
      it('returns a 200 response with a product', () => {
        return request(app.getHttpServer())
          .get(`/products/${product.id}`)
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('when product with id does not exist', () => {
      it('returns a 404 response', () => {
        return request(app.getHttpServer())
          .get(`/products/1234`)
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(404);
          });
      });
    });
  });

  describe('POST /products', () => {
    describe('with valid data', () => {
      it('returns a 201 response with the product', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send({
            name: 'New Product',
            description: 'Description for New Product.',
            priceSubunit: 1000,
            priceCurrency: 'GBP',
          })
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(201);
          });
      });
    });

    describe('with invalid data', () => {
      it('returns a 400 response with an error', () => {
        return request(app.getHttpServer())
          .post('/products')
          .send({ name: 123 })
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(400);
          });
      });
    });
  });

  describe('PATCH /products', () => {
    describe('with valid data', () => {
      it('returns a 200 response with the product', () => {
        return request(app.getHttpServer())
          .patch(`/products/${product.id}`)
          .send({
            name: 'Updated Product',
            categories: [1]
          })
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });

    describe('with invalid data', () => {
      it('returns a 400 response with an error', () => {
        return request(app.getHttpServer())
          .patch(`/products/${product.id}`)
          .send({ name: 123 })
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(400);
          });
      });
    });

    describe('with nonexistent id', () => {
      it('returns a 404 response', () => {
        return request(app.getHttpServer())
          .patch(`/products/1234`)
          .send({
            name: 'Updated Product',
            categories: [1]
          })
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(404);
          });
      });
    });
  });

  describe('DELETE /products/{id}', () => {
    describe('when product with id exists', () => {
      it('returns a 200 response', () => {
        return request(app.getHttpServer())
          .delete(`/products/${product.id}`)
          .set({ Authorization: token })
          .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
          });
      });
    });
  });
});
