import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../users/user.entity';
import { AuditService } from '../audit/audit.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly auditService: AuditService,
  ) {}


  @Get()
  findAll(@Req() req: any) {
    this.auditService.log('VIEW ALL TASKS', req.user);

    return this.tasksService.findAll(req.user.organizationId);
  }

  @Get('mine')
  findMine(@Req() req: any) {
    this.auditService.log('VIEW OWN TASKS', req.user);

    return this.tasksService.findMine(
      req.user.organizationId,
      req.user.sub,
    );
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body()
    body: {
      title: string;
      category?: 'Work' | 'Personal';
    },
    @Req() req: any,
  ) {
    this.auditService.log(
      `CREATE TASK: "${body.title}"`,
      req.user,
    );

    return this.tasksService.create(
      body.title,
      body.category,
      req.user.organizationId,
      req.user.sub,
    );
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body()
    updates: {
      title?: string;
      status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
      category?: 'Work' | 'Personal';
    },
    @Req() req: any,
  ) {
    this.auditService.log(
      `UPDATE TASK ${id} → ${JSON.stringify(updates)}`,
      req.user,
    );

    return this.tasksService.update(Number(id), updates);
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  delete(@Param('id') id: string, @Req() req: any) {
    this.auditService.log(`DELETE TASK ${id}`, req.user);

    return this.tasksService.delete(Number(id));
  }
}
