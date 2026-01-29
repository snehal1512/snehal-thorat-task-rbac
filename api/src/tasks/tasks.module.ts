import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuditModule, // 🔥 THIS IS THE FIX
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
