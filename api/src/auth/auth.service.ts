import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      email: 'owner@test.com',
      password: 'password', // plain-text (TEMP)
      role: 'OWNER',
      organizationId: 1,
    },
    {
      id: 2,
      email: 'viewer@test.com',
      password: 'password', // plain-text (TEMP)
      role: 'VIEWER',
      organizationId: 1,
    },
  ];

  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = this.users.find(u => u.email === email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
