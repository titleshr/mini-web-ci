import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(email: string, password: string) {
    if (!email || !email.includes('@')) {
      throw new UnauthorizedException('Invalid email');
    }

    if (!password || password.length < 8) {
      throw new UnauthorizedException('Invalid password');
    }

    if (email === 'admin@test.com' && password === 'password123') {
      return {
        accessToken: 'mock-token',
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}