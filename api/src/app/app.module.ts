import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import { Organization } from '../organizations/organization.entity';

import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        Task,
        User,
        Organization,
      ],
      synchronize: true,
    }),

    TasksModule,
    SeedModule,
    AuthModule,
    AuditModule,
  ],
})
export class AppModule {}
