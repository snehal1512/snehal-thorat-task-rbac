import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Task } from '../tasks/task.entity';

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @ManyToOne(() => Organization, org => org.users, { eager: true })
  organization: Organization;

  @OneToMany(() => Task, task => task.createdBy)
  tasks: Task[];
}
