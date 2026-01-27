import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskCategory = 'Work' | 'Personal';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'TODO' })
  status: TaskStatus;

  @Column({ default: 'Work' })
  category: TaskCategory;

  @Column()
  organizationId: number;

  // ✅ NEW: user who created the task
  @Column()
  createdBy: number;
}
