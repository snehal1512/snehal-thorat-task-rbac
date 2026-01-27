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
import { Role } from '../auth/roles.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // All tasks in org
  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user.organizationId);
  }

  // Tasks created by logged-in user
  @Get('mine')
  findMine(@Req() req: any) {
    return this.tasksService.findMine(
      req.user.organizationId,
      req.user.sub,
    );
  }

  // Create task
  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body() body: { title: string; category?: 'Work' | 'Personal' },
    @Req() req: any,
  ) {
    return this.tasksService.create(
      body.title,
      body.category,
      req.user.organizationId,
      req.user.sub,
    );
  }

  // Update task
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
  ) {
    return this.tasksService.update(Number(id), updates);
  }

  // Delete task
  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.tasksService.delete(Number(id));
  }
}
