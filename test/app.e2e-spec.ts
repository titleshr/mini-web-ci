import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/login should return access token when credentials are correct', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'password123',
      })
      .expect(201)
      .expect({
        accessToken: 'mock-token',
      });
  });

  it('POST /auth/login should return 401 when email is invalid', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-email',
        password: 'password123',
      })
      .expect(401);
  });

  it('POST /auth/login should return 401 when password is too short', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: '123',
      })
      .expect(401);
  });

  it('POST /auth/login should return 401 when credentials are incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'wrongpass',
      })
      .expect(401);
  });
});