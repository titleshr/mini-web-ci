import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should return access token when login success', () => {
    const result = controller.login({
      email: 'admin@test.com',
      password: 'password123',
    });

    expect(result).toEqual({
      accessToken: 'mock-token',
    });
  });
});