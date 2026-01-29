import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';
import { TasksService } from '../services/tasks.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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
  allTasks: Task[] = [];
  isLoading = false;

  title = '';
  category: Category = 'Work';

  filter: 'All' | Category = 'All';
  statusFilter: 'All' | Status = 'All';

  userRole: 'OWNER' | 'ADMIN' | 'VIEWER' = 'VIEWER';

  columns: { id: Status; title: string; bg: string }[] = [
    { id: 'TODO', title: 'Todo', bg: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', bg: 'bg-yellow-50' },
    { id: 'COMPLETED', title: 'Completed', bg: 'bg-green-50' },
  ];

  connectedDropLists: Status[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole(); // REQUIRED
    this.loadTasks();
  }

  get isViewer(): boolean {
    return this.userRole === 'VIEWER';
  }

  loadTasks(): void {
  this.isLoading = true;

  this.tasksService.getTasks()
    .pipe(finalize(() => {
      this.isLoading = false;
      this.cdr.detectChanges(); // 👈 ADD
    }))
    .subscribe({
      next: tasks => {
        this.allTasks = tasks;
        this.cdr.detectChanges(); // 👈 ADD
      },
      error: err => console.error('Failed to load tasks', err),
    });
}

  refresh(): void {
    this.loadTasks();
  }

  submitTask(): void {
    if (this.isViewer || !this.title.trim()) return;

    this.tasksService.createTask({
      title: this.title,
      category: this.category,
    }).subscribe(() => {
      this.title = '';
      this.loadTasks();
    });
  }

  deleteTask(taskId: number): void {
    if (this.isViewer) return;

    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.allTasks = this.allTasks.filter(t => t.id !== taskId);
    });
  }

  dropToStatus(event: CdkDragDrop<Task[]>, status: Status): void {
    if (this.isViewer) return;

    const task = event.item.data as Task;
    if (!task || task.status === status) return;

    task.status = status;

    this.tasksService.updateTask(task.id, { status }).subscribe({
      error: () => this.loadTasks(), // rollback if fail
    });
  }

  tasksByStatus(status: Status): Task[] {
    return this.allTasks.filter(task => {
      if (task.status !== status) return false;
      if (this.filter !== 'All' && task.category !== this.filter) return false;
      if (this.statusFilter !== 'All' && task.status !== this.statusFilter) return false;
      return true;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
