import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should return access token when email and password are correct', () => {
    const result = service.login('admin@test.com', 'password123');

    expect(result).toEqual({
      accessToken: 'mock-token',
    });
  });

  it('should throw UnauthorizedException when email is invalid', () => {
    expect(() => service.login('invalid-email', 'password123')).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password length is less than 8', () => {
    expect(() => service.login('admin@test.com', '123')).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when credentials are incorrect', () => {
    expect(() => service.login('admin@test.com', 'wrongpass')).toThrow(
      UnauthorizedException,
    );
  });
});