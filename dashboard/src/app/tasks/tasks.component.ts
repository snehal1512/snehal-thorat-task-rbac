import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../services/tasks.service';
import { AuthService } from '../services/auth.service';

type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
type Category = 'Work' | 'Personal';

interface Task {
  id: number;
  title: string;
  status: Status;
  category: Category;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {

  isLoading = true;

  tasks: Task[] = [];

  title = '';
  category: Category = 'Work';
  filter: 'All' | Category = 'All';
  statusFilter: 'All' | Status = 'All';

  userRole: 'OWNER' | 'ADMIN' | 'VIEWER' = 'VIEWER';

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.loadTasks();
  }

  get isViewer(): boolean {
    return this.userRole === 'VIEWER';
  }

  loadTasks(): void {
  this.isLoading = true;

  this.tasksService.getTasks().subscribe({
    next: (tasks) => {
      this.tasks = tasks;
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    },
  });
}


  submitTask(): void {
    if (this.isViewer || !this.title.trim()) return;

    this.tasksService.createTask({
      title: this.title,
      category: this.category,
    }).subscribe({
      next: () => {
        this.title = '';
        this.loadTasks();
      },
      error: (err) => {
        if (err.status === 403) {
          alert('You are not allowed to create tasks.');
        }
      },
    });
  }

  deleteTask(taskId: number): void {
    if (this.isViewer) return;

    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
    });
  }

  dropToStatus(event: CdkDragDrop<Task[]>, status: Status): void {
    if (this.isViewer) return;

    const task = event.item.data as Task;

    if (task.status === status) return;

    this.tasksService.updateTask(task.id, { status }).subscribe(() => {
      this.loadTasks();
    });
  }

  getTasksByStatus(status: Status): Task[] {
    return this.tasks.filter(task => {
      if (task.status !== status) return false;
      if (this.filter !== 'All' && task.category !== this.filter) return false;
      if (this.statusFilter !== 'All' && task.status !== this.statusFilter) return false;
      return true;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
