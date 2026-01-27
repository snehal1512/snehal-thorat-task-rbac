import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  // GET all tasks
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // CREATE task
  createTask(task: { title: string; category: 'Work' | 'Personal' }): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  // UPDATE task
  updateTask(
    id: number,
    updates: {
        title?: string;
        status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
        category?: 'Work' | 'Personal';
    }
    ) {
    return this.http.patch(`${this.apiUrl}/${id}`, updates);
    }


  // DELETE task
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // (Optional) My tasks only
  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mine`);
  }
}
