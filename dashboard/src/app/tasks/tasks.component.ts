import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DragDropModule,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { TasksService } from '../services/tasks.service';

type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
type Category = 'Work' | 'Personal';

interface Task {
  id: number;
  title: string;
  status: Status;
  category: Category;
  createdBy: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  // Create / Edit
  title = '';
  category: Category = 'Work';
  editingTaskId: number | null = null;

  // Filters
  filter: 'All' | Category = 'All';
  statusFilter: 'All' | Status = 'All';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  // --------------------
  // CREATE / UPDATE
  // --------------------
  submitTask(): void {
    if (!this.title.trim()) return;

    if (this.editingTaskId) {
      const task = this.tasks.find(t => t.id === this.editingTaskId);
      if (task) {
        task.title = this.title;
        task.category = this.category;
      }

      this.tasksService.updateTask(this.editingTaskId, {
        title: this.title,
        category: this.category,
      }).subscribe({
        error: () => this.loadTasks(),
      });

      this.resetForm();
      return;
    }

    const tempTask: Task = {
      id: Date.now(),
      title: this.title,
      category: this.category,
      status: 'TODO',
      createdBy: 0,
    };

    this.tasks.unshift(tempTask);

    this.tasksService.createTask({
      title: this.title,
      category: this.category,
    }).subscribe({
      next: () => this.loadTasks(),
      error: () => this.loadTasks(),
    });

    this.resetForm();
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
    this.title = task.title;
    this.category = task.category;
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);

    this.tasksService.deleteTask(taskId).subscribe({
      error: () => this.loadTasks(),
    });
  }

  resetForm(): void {
    this.title = '';
    this.category = 'Work';
    this.editingTaskId = null;
  }

  // --------------------
  // FILTER HELPERS
  // --------------------
  filteredTasks(): Task[] {
    let list = [...this.tasks];

    if (this.filter !== 'All') {
      list = list.filter(t => t.category === this.filter);
    }

    if (this.statusFilter !== 'All') {
      list = list.filter(t => t.status === this.statusFilter);
    }

    return list;
  }

  getTasksByStatus(status: Status): Task[] {
    return this.filteredTasks().filter(t => t.status === status);
  }

  // --------------------
  // DRAG BETWEEN COLUMNS
  // --------------------
  dropToStatus(
    event: CdkDragDrop<Task[]>,
    newStatus: Status
  ): void {
    const task = event.item.data as Task;

    if (!task || task.status === newStatus) return;

    // Optimistic update
    task.status = newStatus;

    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      error: () => this.loadTasks(),
    });
  }

  // --------------------
  // LOGOUT
  // --------------------
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
