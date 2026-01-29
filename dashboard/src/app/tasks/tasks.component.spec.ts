import { TestBed } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TasksService } from '../services/tasks.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('TasksComponent', () => {
  let component: TasksComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getTasks: () => of([]),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getRole: () => 'ADMIN',
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
  });

  it('loads tasks on init', () => {
    component.ngOnInit();
    expect(component.allTasks.length).toBe(0);
  });

  it('admin can create task', () => {
    component.title = 'Test';
    expect(component.isViewer).toBe(false);
  });
});
