import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';

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

  @Column()
  category: TaskCategory;

  @ManyToOne(() => Organization, org => org.tasks, { eager: true })
  organization: Organization;

  @ManyToOne(() => User, user => user.tasks, { eager: true })
  createdBy: User;
}
