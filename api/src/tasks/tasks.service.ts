import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './task.entity';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  // ------------------------
  // READ
  // ------------------------
  findAll(orgId: number) {
    return this.taskRepo.find({
      where: {
        organization: { id: orgId },
      },
      order: { id: 'DESC' },
    });
  }

  findMine(orgId: number, userId: number) {
    return this.taskRepo.find({
      where: {
        organization: { id: orgId },
        createdBy: { id: userId },
      },
      order: { id: 'DESC' },
    });
  }

  // ------------------------
  // CREATE
  // ------------------------
  create(
    title: string,
    category: 'Work' | 'Personal' = 'Work',
    organizationId: number,
    userId: number,
  ) {
    const task = this.taskRepo.create({
      title,
      category,
      status: 'TODO',
      organization: { id: organizationId } as Organization,
      createdBy: { id: userId } as User,
    });

    return this.taskRepo.save(task);
  }

  // ------------------------
  // UPDATE
  // ------------------------
  async update(
    id: number,
    updates: {
      title?: string;
      status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
      category?: 'Work' | 'Personal';
    },
  ) {
    const task = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updates);
    return this.taskRepo.save(task);
  }

  // ------------------------
  // DELETE
  // ------------------------
  async delete(id: number) {
    const task = await this.taskRepo.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepo.remove(task);
    return { success: true };
  }
}
