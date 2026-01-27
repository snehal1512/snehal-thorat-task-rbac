import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../services/tasks.service';

type Status = 'TODO' | 'DONE';

interface Task {
  id: number;
  title: string;
  status: Status;
  organizationId: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  title = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }

  createTask(): void {
    if (!this.title.trim()) return;

    this.tasksService.createTask({ title: this.title }).subscribe(() => {
      this.title = '';
      this.loadTasks();
    });
  }

  // ✅ THIS METHOD MUST EXIST
  toggleStatus(task: Task): void {
    task.status = task.status === 'TODO' ? 'DONE' : 'TODO';
  }
}
