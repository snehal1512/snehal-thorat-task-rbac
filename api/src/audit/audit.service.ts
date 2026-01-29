import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  log(action: string, user: any) {
    const entry = `[${new Date().toISOString()}] USER ${
      user.sub
    } (${user.role}) → ${action}`;

    console.log(entry);
  }
}
