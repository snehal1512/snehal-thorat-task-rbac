import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskCategory } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // All tasks in organization
  findAll(organizationId: number) {
    return this.taskRepo.find({
      where: { organizationId },
    });
  }

  // Tasks created by logged-in user
  findMine(organizationId: number, userId: number) {
    return this.taskRepo.find({
      where: {
        organizationId,
        createdBy: userId,
      },
    });
  }

  create(
    title: string,
    category: TaskCategory | undefined,
    organizationId: number,
    userId: number,
  ) {
    const task: Partial<Task> = {
      title,
      category: category ?? 'Work',
      status: 'TODO',
      organizationId,
      createdBy: userId,
    };

    return this.taskRepo.save(task);
  }

  update(id: number, updates: Partial<Task>) {
    return this.taskRepo.update(id, updates);
  }

  delete(id: number) {
    return this.taskRepo.delete(id);
  }
}
