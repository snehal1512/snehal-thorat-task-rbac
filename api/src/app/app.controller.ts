import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../api/src/auth/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getData() {
    return { message: 'Protected API' };
  }
}
